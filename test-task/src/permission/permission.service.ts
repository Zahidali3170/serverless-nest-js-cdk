// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Permission } from './permission.entity';
// import { PermissionDto } from './dto/permission.dto';

// @Injectable()
// export class PermissionService {
//   constructor(
//     @InjectRepository(Permission)
//     private permissionRepository: Repository<Permission>,
//   ) {}

//   // Create permission
//   async create(data: PermissionDto) {
//     try {
//       const permission = this.permissionRepository.create(data);
//       const savedPermission = await this.permissionRepository.save(permission);
//       return {
//         statusCode: HttpStatus.OK,
//         message: 'Permission created successfully',
//         data: savedPermission,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           statusCode: HttpStatus.BAD_REQUEST,
//           message: 'Error creating permission',
//           error: error.message,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   // Find all permissions
//   async findAll() {
//     try {
//       const permissions = await this.permissionRepository.find();
//       return {
//         statusCode: HttpStatus.OK,
//         message: 'Permissions fetched successfully',
//         data: permissions,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           statusCode: HttpStatus.BAD_REQUEST,
//           message: 'Error fetching permissions',
//           error: error.message,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   // Remove permission by ID
//   async removePermission(id: string) {
//     try {
//       const permission = await this.permissionRepository.findOne({ where: { permissionId:id } });
//       if (!permission) {
//         throw new HttpException(
//           {
//             statusCode: HttpStatus.NOT_FOUND,
//             message: 'Permission not found',
//           },
//           HttpStatus.NOT_FOUND,
//         );
//       }

//       await this.permissionRepository.remove(permission);
//       return {
//         statusCode: HttpStatus.OK,
//         message: 'Permission removed successfully',
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           statusCode: HttpStatus.BAD_REQUEST,
//           message: 'Error removing permission',
//           error: error.message,
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }
// }
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { PermissionDto } from './dto/permission.dto';
import { Admin } from 'src/user/admin.entity'; // Assuming you have this entity
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Admin) // Inject Admin repository to check user roles
    private adminRepository: Repository<User>,
  ) {}

  // Create permission
  async create(data: PermissionDto, adminId: any) {
    try {
      const permission = this.permissionRepository.create(data);
      const savedPermission = await this.permissionRepository.save(permission);
      return {
        statusCode: HttpStatus.OK,
        message: 'Permission created successfully',
        data: savedPermission,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error creating permission',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Find all permissions
  async findAll(adminId: any) {
    try {
      // Check if the logged-in user is a Super Admin
      const admin = await this.adminRepository.findOne({ where: { id: adminId } });

      if (!admin || admin.username !== 'super Admin') {
        throw new UnauthorizedException('Only Super Admins have the right to view permissions');
      }

      const permissions = await this.permissionRepository.find();
      return {
        statusCode: HttpStatus.OK,
        message: 'Permissions fetched successfully',
        data: permissions,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error fetching permissions',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Remove permission by ID
  async removePermission(id: string, adminId: any) {
    try {
      // Check if the logged-in user is a Super Admin
      const admin = await this.adminRepository.findOne({ where: { id: adminId } });
  
      if (!admin || admin.username !== 'super Admin') {
        throw new UnauthorizedException('Only Super Admins have the right to remove permissions');
      }
  
      const permission = await this.permissionRepository.findOne({ where: { permissionId:id } });
  
      if (!permission) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Permission not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      await this.permissionRepository.remove(permission);
      return {
        statusCode: HttpStatus.OK,
        message: 'Permission removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error removing permission',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
