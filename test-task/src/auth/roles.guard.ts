
import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role?.includes('Super Admin')) {
      return true;
    }

    if (requiredRoles) {
      const userRoles = user.roles.map((role) => role.name);
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException('You do not have the required role to access this resource');
      }
      const userPermissions = user.roles.map((role): { readPermission: boolean, createPermission: boolean, deletePermission: boolean, updatePermission: boolean } => ({
        readPermission: role.readPermission,
        createPermission: role.createPermission,
        deletePermission: role.deletePermission,
        updatePermission: role.updatePermission,
      }));

      const hasPermissions = userPermissions.some((perm) =>
        perm.readPermission || perm.createPermission || perm.deletePermission || perm.updatePermission
      );
      if (!hasPermissions) {
        throw new ForbiddenException('You do not have the required permissions to access this resource');
      }
    }


    // Check permissions
    // if (requiredPermissions) {
    //   if (!user.permissions || !Array.isArray(user.permissions)) {
    //     throw new ForbiddenException('User permissions are not properly assigned');
    //   }
    //   const hasPermission = user.permissions.some((permission) =>
    //     requiredPermissions.includes(permission),
    //   );
    //   if (!hasPermission) {
    //     throw new ForbiddenException('You do not have the required permission to access this resource');
    //   }
    // }

    return true;
  }
}


