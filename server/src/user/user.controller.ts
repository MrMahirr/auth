import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
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

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    return await this.userService.createUser(createUserDto);
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.generateUserResponse(user);
  }
  @Post('users/google-login')
  async googleLogin(
    @Body('user') googleLoginDto: GoogleLoginDto,
  ): Promise<IUserResponse> {
    return this.userService.loginWithGoogle(googleLoginDto);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const updatedUser = await this.userService.updateUser(
      userId,
      updateUserDto,
    );
    return this.userService.generateUserResponse(updatedUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user): Promise<IUserResponse> {
    return this.userService.generateUserResponse(user);
  }
}
