import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly username: string;
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly bio: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly image: string;
}
