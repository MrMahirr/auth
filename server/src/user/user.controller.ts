import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
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

  private setRefreshCookie(res: express.Response, token: string): void {
    const cookieOptions: express.CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    console.log('[SetRefreshCookie] 🍪 Cookie ayarları:', {
      cookieOptions,
      tokenLength: token.length,
      tokenPreview: `${token.substring(0, 20)}...`,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    res.cookie('refreshToken', token, cookieOptions);
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    try {
      const result = await this.userService.createUser(dto);

      const token = result.user.refreshToken;
      if (token) this.setRefreshCookie(res, token);

      delete result.user.refreshToken;

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';

      console.error('[CreateUser] Error:', message);

      throw new HttpException(
        'Kullanıcı oluşturulurken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    try {
      const result = await this.userService.loginUser(dto);

      const token = result.user.refreshToken;
      if (token) this.setRefreshCookie(res, token);

      delete result.user.refreshToken;

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[LoginUser] Error:', message);

      throw new HttpException(
        'Giriş yapılırken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('users/google-login')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<IUserResponse> {
    try {
      const result = await this.userService.loginWithGoogle(dto);

      const token = result.user.refreshToken;
      if (token) this.setRefreshCookie(res, token);

      delete result.user.refreshToken;

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GoogleLogin] Error:', message);

      throw new HttpException(
        'Google ile giriş yapılırken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: express.Request,
  ): Promise<IUserResponse> {
    try {
      const cookies = req.cookies as Record<string, string | undefined>;
      const refreshToken = cookies?.refreshToken;

      if (!refreshToken) {
        throw new HttpException(
          'Refresh token bulunamadı',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.userService.refreshTokens(refreshToken);

      const token = result.user.refreshToken;
      if (token) this.setRefreshCookie(res, token);

      delete result.user.refreshToken;

      return result;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[RefreshToken] Error:', message);

      throw new HttpException(
        'Token yenilenirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @User('id') userId: number,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ message: string }> {
    try {
      await this.userService.logout(userId);
      res.clearCookie('refreshToken');

      return { message: 'Logged out successfully' };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Logout] Error:', message);

      throw new HttpException(
        'Çıkış yapılırken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') dto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(userId, dto);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[UpdateUser] Error:', message);

      throw new HttpException(
        'Kullanıcı güncellenirken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@User() reqUser: UserEntity): Promise<UserEntity> {
    try {
      const user = await this.userService.findById(reqUser.id);
      if (user) delete user.password;
      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GetProfile] Error:', message);

      throw new HttpException(
        'Profil bilgileri alınırken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
