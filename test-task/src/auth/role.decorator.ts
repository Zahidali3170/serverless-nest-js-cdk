// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/permission/permission.entity';
import { Role } from 'src/role/role.entity';
import { SuperRole } from 'src/user/enum/role.enum';


export type RoleType = string | Role | SuperRole | [];
export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);