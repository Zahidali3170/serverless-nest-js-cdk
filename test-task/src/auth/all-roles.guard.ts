
import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AllRolesGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  private getDynamicRoles = async () => await this.roleService.getDynamicRoles();
  private getSuperAdminRoles = async () => await this.userService.getSuperAdminRoles();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = await this.getDynamicRoles();
    const superRequiredRoles = await this.getSuperAdminRoles();

    // Check if there are required roles defined
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('No roles are defined. Access denied');
    }

    // Getting permissions metadata for the route handler
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Debugging output for user roles
    console.log('User roles extracted: ', user.role);

    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    if (user.role === 'Super Admin') {
        return true; // Super Admin bypasses the role check
      }

    // Check if user roles are properly assigned
    if (!user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('Roles are not properly assigned');
    }
    const userRoles = user.roles.map(role => role?.name);
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    console.log('User roles extracted: ', hasRole);

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role to access this resource');
    }

    const hasPermissions = this.validatePermissions(user);
    console.log('User roles extracted: ', hasPermissions);
    if (!hasPermissions) {
      throw new ForbiddenException('You do not have the required permissions to access this resource');
    }

    return true;
  }

  private validatePermissions(user: any): boolean {
    const userPermissions = user.roles?.map((role) => ({
      readPermission: role?.readPermission,
      createPermission: role?.createPermission,
      deletePermission: role?.deletePermission,
      updatePermission: role?.updatePermission,
    })) || [];
    console.log('User roles extracted: ', userPermissions);
    return userPermissions.some(
      (perm) => perm.readPermission || perm.createPermission || perm.deletePermission || perm.updatePermission
    );
  }
}
