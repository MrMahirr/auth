import { UserService } from '@/user/user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.createUser(createUserDto);
  }
}
