import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/createUser.dto';

@Injectable()
export class UserService {
  createUser(createUserDto: CreateUserDto): CreateUserDto {
    return createUserDto;
  }
}
