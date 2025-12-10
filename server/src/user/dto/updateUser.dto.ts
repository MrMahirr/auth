import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  dateofbirth: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  image: string;
}
