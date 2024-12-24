import { IsString, IsEnum, IsNotEmpty, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SuperRole } from '../enum/role.enum';


export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password for the user account. It must be at least 6 characters long.',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role id to be assigned to the admin',
    example: '3f8b776f-8b7b-4d88-9a74-d760d9b8b8fc',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  roleId?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe_updated',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'The password for the user account. It must be at least 6 characters long.',
    example: 'newpassword123',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

}
