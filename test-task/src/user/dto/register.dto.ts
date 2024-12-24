import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsIn, IsEnum, isEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Role of the user (e.g., user, admin, super-admin)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['user', 'admin', 'super-admin'], {
    message: 'Role must be one of the following: user, admin, super-admin',
  })
  role: string;
}
