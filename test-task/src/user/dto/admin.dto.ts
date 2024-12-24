import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, IsNotEmpty, Matches } from 'class-validator';

export class CreateSuperAdminDto {
  @ApiProperty({ description: 'The username of the admin' })
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Matches(/^[^\d][a-zA-Z0-9_]*$/, {
    message: 'Username cannot start with a number and not space like (Test world)',
  })
  username: string;

  @ApiProperty({ description: 'The email address of the admin' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @Matches(/^[^\d][\w]*@.+$/, { message: 'Email cannot start with a number' })
  email: string;

  @ApiProperty({ description: 'The password of the admin' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Za-z])(?=.*\d).{6,12}$/, {
    message:
      'Password must be 6-12 characters long, contain at least one special character, one letter, and one number',
  })
  password: string;

 
}
export class UpdateUserDto {
  @ApiProperty({
    description: 'The username of the user (optional, if updating)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Matches(/^[^\d][a-zA-Z0-9_]*$/, {
    message: 'Username cannot start with a number and must not contain spaces (e.g., Test_world)',
  })
  username?: string;

  @ApiProperty({
    description: 'The email address of the user (optional, if updating)',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @Matches(/^[^\d][\w]*@.+$/, { message: 'Email cannot start with a number' })
  email?: string;
}
