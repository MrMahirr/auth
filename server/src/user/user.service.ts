import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from '@/user/types/userResponse.interface';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { LoginDto } from '@/user/dto/loginUser.dto';
import { GoogleLoginDto } from '@/user/dto/googleLogin.dto';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const savedUser = await this.userRepository.save(newUser);
    return this.buildAuthResponse(savedUser);
  }

  async loginUser(loginUserDto: LoginDto): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: ['id', 'username', 'email', 'password', 'image', 'bio'],
    });

    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatches = await compare(
      loginUserDto.password,
      user.password!,
    );

    if (!passwordMatches) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;
    return this.buildAuthResponse(user);
  }

  async loginWithGoogle(
    googleLoginDto: GoogleLoginDto,
  ): Promise<IUserResponse> {
    let user = await this.userRepository.findOne({
      where: { email: googleLoginDto.email },
    });

    if (!user) {
      const newUser = new UserEntity();
      newUser.email = googleLoginDto.email;
      newUser.username = googleLoginDto.username;
      newUser.password = Math.random().toString(36).slice(-8) + 'Aa1!';
      user = await this.userRepository.save(newUser);
    }

    return this.buildAuthResponse(user);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  private getAccessToken(user: UserEntity) {
    const payload = { id: user.id, email: user.email };

    const secret = this.configService.getOrThrow<string>(
      'JWT_SECRET',
    ) as Secret;

    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_EXPIRES_IN',
    ) as SignOptions['expiresIn'];

    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, secret, options);
  }

  private getRefreshToken(user: UserEntity) {
    const payload = { id: user.id, email: user.email };

    const secret = this.configService.getOrThrow<string>(
      'JWT_REFRESH_SECRET',
    ) as Secret;

    const expiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) as SignOptions['expiresIn'];

    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, secret, options);
  }

  private async setRefreshToken(user: UserEntity, token: string) {
    const hashed = await hash(token, 10);
    user.refreshToken = hashed;
    await this.userRepository.save(user);
  }

  private async buildAuthResponse(user: UserEntity): Promise<IUserResponse> {
    const accessToken = this.getAccessToken(user);
    const refreshToken = this.getRefreshToken(user);

    await this.setRefreshToken(user, refreshToken);
    delete user.password;

    const plainUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email,
      image: user.image,
      bio: user.bio,
    };
    return {
      user: {
        ...plainUser,
        token: accessToken,
        refreshToken,
      },
    };
  }

  async refreshTokens(userId: number, oldToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh request');

    const matches = await compare(oldToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException('Refresh token mismatch');

    return this.buildAuthResponse(user);
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }
}
