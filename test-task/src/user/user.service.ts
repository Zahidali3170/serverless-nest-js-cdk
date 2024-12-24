import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInfoDto, UpdateUserInfoDto } from 'src/user/dto/user-info.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Admin } from './admin.entity';
import { CreateSuperAdminDto, UpdateUserDto } from './dto/admin.dto';
import { Role } from 'src/role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }

  async findAllAdmin() {
    try {
      const admins = await this.adminsRepository.find();
      return admins.map(({ password, ...rest }) => rest);
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new InternalServerErrorException('Error fetching admins');
    }
  }

  async findAll(user: any) {
    try {
      if (user !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const users = await this.adminsRepository.find();
      if (!users.length) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('No users found');
    }
  }

  async findById( id: string,superAdmin: any) {
    try {
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const user = await this.adminsRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error finding user with ID ${id}:`, error);
      throw new InternalServerErrorException(`User with ID ${id} not found`);
    }
  }

  async create(createUserDto: CreateSuperAdminDto, superAdmin: any) {
    try {
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
  
      if (!createUserDto.password || !createUserDto.email) {
        throw new BadRequestException('Missing required fields: email or password');
      }
  
      const emailExists = await this.adminsRepository.findOneBy({ email: createUserDto.email });
      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
  
      if (createUserDto.username) {
        const usernameExists = await this.adminsRepository.findOneBy({ username: createUserDto.username });
        if (usernameExists) {
          throw new BadRequestException('Username already exists');
        }
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const user = this.adminsRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
  
      const savedUser = await this.adminsRepository.save(user);
  
      return { message: 'User created successfully', data: savedUser };
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Access denied: Only Super Admins can access this resource.');
      }
    }
  }
  

  async update(id: any, updateUserDto: UpdateUserDto, superAdmin: any) {
    try {
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
  
      const user = await this.adminsRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
        const { username, email } = updateUserDto;
  
      if (username) {
        const existingUserWithUsername = await this.adminsRepository.findOne({ where: { username } });
        if (existingUserWithUsername && existingUserWithUsername.id !== id) {
          throw new BadRequestException('Username already exists');
        }
      }
  
      if (email) {
        const existingUserWithEmail = await this.adminsRepository.findOne({ where: { email } });
        if (existingUserWithEmail && existingUserWithEmail.id !== id) {
          throw new BadRequestException('Email already exists');
        }
      }
  
      const updatedUser = Object.assign(user, updateUserDto, {updatedAt: new Date()} );
      const savedUser = await this.adminsRepository.save(updatedUser);
  
      return { message: 'User updated successfully', data: savedUser };
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
  
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Access denied: Only Super Admins can access this resource.');
      }
    }
  }
  

  async remove(id: string, superAdmin: any) {
    try {
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const result = await this.adminsRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(`Error deleting user with ID ${id}`);
      }
    }
  }

  async assignRole(userId: any, roleId: string, superAdmin: any): Promise<Admin> {
    try {
      if (superAdmin !== 'Super Admin') {
        throw new NotFoundException('Access denied: Only Super Admins can access this resource.');
      }
      const user = await this.adminsRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      if (!user.roles) {
        user.roles = [];
      }

      user.roles.push(role);
      const userRole = await this.adminsRepository.save(user);

      return userRole;
    } catch (error) {
      console.error(`Error assigning role to user with ID ${userId}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Access denied: Only Super Admins can access this resource.');
      }
    }
  }
  async getSuperAdminRoles() {
    const roles = await this.userRepository.find();
    return roles.map(role => role);
  }

}
