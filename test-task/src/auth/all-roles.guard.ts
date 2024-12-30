import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AllRolesGuard {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  private getDynamicRoles = async () => await this.roleService.getDynamicRoles();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = await this.getDynamicRoles();

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('No roles are defined. Access denied');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User roles extracted: ', user.role);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    if (user.role === 'Super Admin') {
      return true;
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Roles are not properly assigned');
    }
    const userRoles = user.roles.map(role => role?.name);
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    console.log('User roles extracted: ', hasRole);

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role to access this resource');
    }

    const hasPermissions = this.validatePermissions(user, request.method);
    console.log('User permissions: ', hasPermissions);
    if (!hasPermissions) {
      throw new ForbiddenException('You do not have the required permissions to access this resource');
    }
    return true;
  }

  private validatePermissions(user: any, method: string): boolean {
    const userPermissions = user.roles?.map((role) => ({
      readPermission: role?.readPermission,
      createPermission: role?.createPermission,
      deletePermission: role?.deletePermission,
      updatePermission: role?.updatePermission,
    })) || [];
    
    switch (method) {
      case 'GET':
        return userPermissions.some(perm => perm.readPermission);
      case 'POST':
        return userPermissions.some(perm => perm.createPermission);
      case 'PUT':
      case 'PATCH':
        return userPermissions.some(perm => perm.updatePermission);
      case 'DELETE':
        return userPermissions.some(perm => perm.deletePermission);
      default:
        return false;
    }
  }
}
