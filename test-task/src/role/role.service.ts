import { Injectable, HttpException, HttpStatus, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleDto, UpdateRoleDto } from './dto/assign-role.dto';
import { Permission } from 'src/permission/permission.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) { }

  async create(createRoleDto: RoleDto, superAdmin:any): Promise<Role> {
    if (superAdmin!=='Super Admin') {
      throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
    }
    // Validate that required fields are present in createRoleDto
    if (!createRoleDto?.name) {
      throw new ForbiddenException('Role name is required');
    }

    // Optional: Check if the role already exists
    const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
    if (existingRole) {
      throw new ForbiddenException('Role with this name already exists');
    }

    // Create and save the role
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  // Fetch all roles with their permissions
  async findAll(superAdmin:any) {
    try {
      if (superAdmin!=='Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const roles = await this.roleRepository.find();
      return {
        statusCode: HttpStatus.OK,
        message: 'Roles fetched successfully',
        data: roles,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error fetching roles',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeRole(id: string, superAdmin:any) {
    try {
      if (superAdmin!=='Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const role = await this.roleRepository.findOne({ where: { roleId: id } });
      if (!role) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Role not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.roleRepository.remove(role);
      return {
        statusCode: HttpStatus.OK,
        message: 'Role removed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error removing role',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Fetch permissions by role
  async getPermissionsByRole(roleId: string): Promise<string[]> {
    // Find the role by ID
    const role = await this.roleRepository.findOne({
      where: { roleId },
      relations: ['permissions'], // Ensure we load the permissions for this role
    });

    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    // Extract permission names from the permissions array
    return role.permissions.map(permission => permission.name);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, superAdmin: any): Promise<Role> {
    try {
      // Check if the user has Super Admin rights
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }

      const role = await this.roleRepository.findOne({ where: { roleId: id } });
      if (!role) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Role not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      const existingRole = await this.roleRepository.findOne({
        where: {
          ...updateRoleDto, 
          roleId: Not(id),
        },
      });
  
      if (existingRole) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'Role with this name already exists.',
          },
          HttpStatus.CONFLICT,
        );
      }

      const updatedRole = Object.assign(role, updateRoleDto);
      return await this.roleRepository.save(updatedRole);
  
    } catch (error) {
      console.error('Error updating role:', error.message);

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Error updating role',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  async getDynamicRoles(){
    const roles = await this.roleRepository.find();
    return roles.map(role => role.name);
  }
}
