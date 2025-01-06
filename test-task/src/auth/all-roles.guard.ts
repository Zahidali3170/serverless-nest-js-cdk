import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
@Injectable()
export class AllRolesGuard {
  constructor() { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === 'Super Admin') {
      return true;
    }
    const resourceTypeRequired = this.getResourceTypeFromRoute(request);
    if (resourceTypeRequired && !this.hasAccessToResourceType(user, resourceTypeRequired)) {
      throw new ForbiddenException(`You do not have access to the ${resourceTypeRequired} resource`);
    }

    const hasPermissions = this.validatePermissions(user, request.method);
    if (!hasPermissions) {
      throw new ForbiddenException('You do not have the required permissions to access this resource');
    }
    return true;
  }

  private getResourceTypeFromRoute(request: any): string {
    const url = request.url;

    if (url.startsWith('/api/user')) {
      return 'Admin';
    }
    if (url.startsWith('/api/users')) {
      return 'User';
    }
    if (url.startsWith('/api/customer')) {
      return 'Customer';
    }
    if (url.startsWith('/api/roles')) {
      return 'Roles';
    }
    return ''; 
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
        return userPermissions.some(perm => perm.updatePermission);
      case 'DELETE':
        return userPermissions.some(perm => perm.deletePermission);
      default:
        return false;
    }
  }
  private hasAccessToResourceType(user: any, resourceType: string): boolean {
    return user.roles?.some(role => role.resourceTypes?.includes(resourceType)) || false;
  }
}
