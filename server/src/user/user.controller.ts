import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';
import { IUserResponse } from '@/user/types/userResponse.interface';
import { LoginDto } from '@/user/dto/loginUser.dto';
import { User } from '@/user/decorators/user.decorator';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UpdateUserDto } from '@/user/dto/updateUser.dto';
import { UserEntity } from '@/user/user.entity';
import express from 'express';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private setRefreshCookie(res: express.Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/refresh',
    });
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    const result = await this.userService.createUser(dto);
    this.setRefreshCookie(res, result.user.refreshToken!);
    delete result.user.refreshToken;
    return result;
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    const result = await this.userService.loginUser(dto);
    this.setRefreshCookie(res, result.user.refreshToken!);
    delete result.user.refreshToken;
    return result;
  }

  @Post('users/google-login')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    const result = await this.userService.loginWithGoogle(dto);
    this.setRefreshCookie(res, result.user.refreshToken!);
    delete result.user.refreshToken;
    return result;
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  async refresh(
    @User('id') userId: number,
    @Body('token') refreshToken: string,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    const result = await this.userService.refreshTokens(userId, refreshToken);
    this.setRefreshCookie(res, result.user.refreshToken!);
    delete result.user.refreshToken;
    return result;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @User('id') userId: number,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.userService.logout(userId);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.updateUser(userId, dto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@User() reqUser: UserEntity): Promise<UserEntity> {
    const user = await this.userService.findById(reqUser.id);
    if (user) delete user.password;
    return user;
  }
}
