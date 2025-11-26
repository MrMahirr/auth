import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { LoginDto } from '@/user/dto/loginUser.dto';
import { GoogleLoginDto } from '@/user/dto/googleLogin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
    return this.generateUserResponse(savedUser);
  }

  async loginUser(loginUserDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const matchPassword = await compare(loginUserDto.password, user.password);
    if (!matchPassword) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete user.password;
    return user;
  }
  async loginWithGoogle(googleLoginDto: GoogleLoginDto): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: googleLoginDto.email },
    });

    if (user) {
      return this.generateUserResponse(user);
    }

    const newUser = new UserEntity();
    newUser.email = googleLoginDto.email;
    // newUser.image = googleLoginDto.avatar; // Entity'de 'image' veya 'avatar' alanı varsa

    let uniqueUsername = googleLoginDto.username;
    const existingUsername = await this.userRepository.findOne({
      where: { username: uniqueUsername },
    });

    if (existingUsername) {
      uniqueUsername = `${uniqueUsername}${Math.floor(Math.random() * 1000)}`;
    }
    newUser.username = uniqueUsername;

    newUser.password = Math.random().toString(36).slice(-8) + 'Aa1!';

    const savedUser = await this.userRepository.save(newUser);
    return this.generateUserResponse(savedUser);
  }
  async FindById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }
  generateUserResponse(user: UserEntity): IUserResponse {

    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
