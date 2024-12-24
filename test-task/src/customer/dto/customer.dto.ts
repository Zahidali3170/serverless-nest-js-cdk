import { IsString, IsEmail, IsOptional, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsFile } from 'nestjs-form-data';

export class CreateCustomerDto {
  @ApiProperty({ description: 'The username of the customer' })
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Matches(/^[^\d][a-zA-Z0-9_]*$/, {
    message: 'Username cannot start with a number and not space like (Test world)',
  })
  username: string;

  @ApiProperty({ description: 'The email address of the customer' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @Matches(/^[^\d][\w]*@.+$/, { message: 'Email cannot start with a number' })
  email: string;

  @ApiProperty({ description: 'The password of the customer' })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Za-z])(?=.*\d).{6,12}$/, {
    message:
      'Password must be 6-12 characters long, contain at least one special character, one letter, and one number',
  })
  password: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsFile({ message: 'File must be a valid file' })
  image?: string;

}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'The username of the customer' })
  @IsOptional()
  @IsString()
  @Matches(/^[^\d][\w]*$/, { message: 'Username cannot start with a number' })
  username?: string;

  @ApiPropertyOptional({ description: 'The email address of the customer' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Matches(/^[^\d][\w]*@.+$/, { message: 'Email cannot start with a number' })
  email?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsFile({ message: 'File must be a valid file' })
  image?: string;
}
