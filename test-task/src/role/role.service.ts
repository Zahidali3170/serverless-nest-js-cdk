import { Injectable, HttpException, HttpStatus, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleDto, UpdateRoleDto } from './dto/assign-role.dto';
import { Permission } from 'src/permission/permission.entity';


@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
  ) { }

  async create(createRoleDto: RoleDto, superAdmin: any): Promise<Role> {
    if (!createRoleDto?.name) {
      throw new NotFoundException('Role name is required');
    }
    const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(superAdmin: any) {
    try {
      const roles = await this.roleRepository.find();
      if (!roles) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Not Found',
        };
      }
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

  async removeRole(id: string, superAdmin: any) {
    try {
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

  async getPermissionsByRole(roleId: string): Promise<string[]> {
    const role = await this.roleRepository.findOne({
      where: { roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return role.permissions.map(permission => permission.name);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, superAdmin: any): Promise<Role> {
    try {
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

  async getDynamicRoles() {
    const roles = await this.roleRepository.find();
    return roles.map(role => role.name);
  }
}
