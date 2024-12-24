import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateUserInfoDto {
  @ApiProperty({
    description: 'Name of user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'phone of user',
    example: '123444',
  })
 
  phone: string;

  @ApiProperty({
    description: 'Age of user ',
    example: '35',
  })
  @MinLength(6)
  age: string; 
}


export class UpdateUserInfoDto  {
  @ApiPropertyOptional({
    description: 'Updated name of user',
    example: 'Jane Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated phone 0f user ',
    example: '1233333',
  })

  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Updated age of user',
    example: '12533',
  })
  @IsOptional()
  age?: number;
}
