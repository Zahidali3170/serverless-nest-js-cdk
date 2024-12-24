import { IsArray, IsString, ArrayNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to a role',
    type: [String],
    example: ['b3c1b77e-f2e1-4e2b-b404-3b8d9e8d8d11', 'f3e2b98a-2394-4de6-8e84-417c6e3b9030'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
