import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly gender: string;
  @IsNotEmpty()
  readonly dateofbirth: string;
  @IsNotEmpty()
  readonly password: string;
  @IsOptional()
  @IsString()
  readonly image: string;
}
