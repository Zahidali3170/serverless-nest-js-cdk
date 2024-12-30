import { Injectable, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/user/admin.entity';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly roleService: RoleService,

  ) {}
  async getPermissionsByUser(userId: string): Promise<string[]> {
    const user = await this.getUserById(userId);
    const roles = user.roles;

    const permissions = await Promise.all(
      roles.map((role) => this.roleService.getPermissionsByRole(role.roleId)),
    );

    return [...new Set(permissions.flat())];
  }
  async getUserById(userId: string) {
    return await this.adminRepository.findOne({ where: { id:userId } });
  }
  async findAll(superAdmin:any): Promise<any> {
    try {
      const loggedInUser = await this.adminRepository.find({
        relations: ['roles'], 
      });

      if (!loggedInUser) {
        throw new NotFoundException('Logged-in user not found');
      }

      return loggedInUser;
    } catch (error) {
      console.error('Error fetching logged-in user with roles :', error);
      throw new InternalServerErrorException('Access denied: Only Super Admins can access this resource.');
    }
  }
  async getUserProfile(userId: string): Promise<any> {
    try {
      const user = await this.adminRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException('User profile not found');
      }

      const userProfile = {
        id: user.id,
        name: user.username, 
        email: user.email,
        roles: user.roles.map(role => role), 
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile Access denied :', error);
      throw new InternalServerErrorException('Access denied');
    }
  }
}
