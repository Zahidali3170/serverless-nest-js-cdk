import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user logging in.',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @ApiProperty({
    description: 'The password of the user logging in.',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
