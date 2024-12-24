import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Create Post',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Allows creating a new post',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Action type for the permission',
    example: 'CREATE',
  })
  @IsString()
  actionType: string;

  @ApiProperty({
    description: 'Resource type associated with the permission',
    example: 'Post',
  })
  @IsString()
  resourceType: string;

  @ApiProperty({
    description: 'ID of the role associated with this permission',
    example: 'a6b2c4d8-e123-4abc-567f-9g0h1ijklmno',
  })
  @IsUUID()
  roleId: string;
}
