import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
    required:true
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Resource Types of the role',
    example: 'Admin',
  })
  @IsString()
  resourceTypes: string;

  @ApiProperty({
    description: 'Description of the role permissions',
    example: 'Full access to all resources',
    required: false,
  })
  @IsString()
  @IsOptional()
  permissionDescription?: string;

  @ApiProperty({
    description: 'Specifies if the role has access to a resource type',
    example: true,
  })
  @IsBoolean()
  readPermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has create permissions',
    example: true,
  })
  @IsBoolean()
  createPermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has delete permissions',
    example: false,
  })
  @IsBoolean()
  deletePermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has update permissions',
    example: true,
  })
  @IsBoolean()
  updatePermission: boolean;
  permissions: any;
}

export class UpdateRoleDto {
  // @ApiProperty({
  //   description: 'Name of the role',
  //   example: 'Admin',
  // })
  // @IsString()
  // @IsOptional()
  // name: string;

  @ApiProperty({
    description: 'Description of the role permissions',
    example: 'Full access to all resources',
    required: false,
  })
  @IsString()
  @IsOptional()
  permissionDescription?: string;

  @ApiProperty({
    description: 'Specifies if the role has access to a resource type',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readPermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has create permissions',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  createPermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has delete permissions',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  deletePermission: boolean;

  @ApiProperty({
    description: 'Specifies if the role has update permissions',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  updatePermission: boolean;

}


