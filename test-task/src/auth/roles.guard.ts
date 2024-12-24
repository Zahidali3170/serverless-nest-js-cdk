
import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles and permissions from metadata
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    // Extract user info from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user.roles)

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super admin bypass - check if user is a super admin
    if (user.role?.includes('Super Admin')) {
      return true; 
    }

    if (requiredRoles) {
      const userRoles = user.roles.map((role) => role.name);
    
      // Check if the user has the required role
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    
      if (!hasRole) {
        throw new ForbiddenException('You do not have the required role to access this resource');
      }
    
      // Check for specific permissions
      const userPermissions = user.roles.map((role):{readPermission:boolean,createPermission:boolean,deletePermission:boolean, updatePermission:boolean} => ({
        readPermission: role.readPermission,
        createPermission: role.createPermission,
        deletePermission: role.deletePermission,
        updatePermission: role.updatePermission,
      }));

      console.log({userPermissions})
    
      const hasPermissions = userPermissions.some((perm) =>
        perm.readPermission || perm.createPermission || perm.deletePermission || perm.updatePermission
      );
      console.log({hasPermissions})
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


// import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { RoleService } from 'src/role/role.service';

// @Injectable()
// export class RolesGuard {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly roleService: RoleService,
//   ) {}

//   private getDynamicRoles = async () => await this.roleService.getDynamicRoles();

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // const requiredRoles = await this.getDynamicRoles();
//     const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
//     if (!requiredRoles || requiredRoles.length === 0) {
//       throw new ForbiddenException('No roles are defined. Access denied');
//     }

//     const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
//       const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     console.log(user.roles)

//     console.log('User roles extracted: ', user?.roles);

//     if (!user) {
//       throw new ForbiddenException('User not authenticated');
//     }

//     if (!user.roles || !Array.isArray(user.roles)) {
//       throw new ForbiddenException('User roles are not properly assigned');
//     }
//     if (user.role?.includes('Super Admin')) {
//       return true; 
//     }

//     const userRoles = user.roles.map((role) => role?.name);
//     const hasRole = requiredRoles.some((role) => userRoles.includes(role));

//     if (!hasRole) {
//       throw new ForbiddenException('You do not have the required role to access this resource');
//     }

//     const hasPermissions = this.validatePermissions(user);

//     if (!hasPermissions) {
//       throw new ForbiddenException('You do not have the required permissions to access this resource');
//     }

//     return true;
//   }

//   private isSuperAdmin(user: any): boolean {
//     console.log('Checking if user is Super Admin');
//     return user?.roles?.some((role: any) => role?.name === 'Super Admin');
//   }

//   private validatePermissions(user: any): boolean {
//     const userPermissions = user?.roles?.map((role) => ({
//       readPermission: role?.readPermission,
//       createPermission: role?.createPermission,
//       deletePermission: role?.deletePermission,
//       updatePermission: role?.updatePermission,
//     })) || [];

//     return userPermissions.some(
//       (perm) => perm.readPermission || perm.createPermission || perm.deletePermission || perm.updatePermission
//     );
//   }
// }


