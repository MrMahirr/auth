import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly surname?: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;
}
