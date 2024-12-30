import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission/permission.service'; // Service to fetch permissions
import { AdminService } from '../admin/admin.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const userPermissions = await this.adminService.getPermissionsByUser(user.id);
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
