import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  surname: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly bio: string;

  @IsOptional()
  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsString()
  dateofbirth: string;


  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly image: string;
}
