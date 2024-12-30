import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

import { S3Service } from './s3.service';


@Injectable()
export class CustomerService {
  private s3Service: S3Service;

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {
    this.s3Service = new S3Service();
  }

  async findAll(customerId: any) {
    try {
      const users = await this.customerRepository.find({
        where: { deletedAt: null },
      });

      if (!users.length) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new ForbiddenException('You do not have permission to read customer');
    }
  }
  async findProfile(customerId: string) {
    try {
      const user = await this.customerRepository.findOne({ where: { id: customerId, deletedAt: null } });
      if (!user) {
        throw new NotFoundException('Customer not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw new ForbiddenException('You do not have permission to read customer');
    }
  }

  async findById(id: string, customerId: any) {
    try {
      const user = await this.customerRepository.findOne({
        where: { id, deletedAt: null },
      });
      if (!user) {
        return new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error finding user with ID ${id}:`, error);
      throw new ForbiddenException('You do not have permission to read customer');
    }
  }

  async findDeleted() {
    try {
      const deletedUsers = await this.customerRepository.find({
        withDeleted: true,
        where: { deletedAt: Not(IsNull()) },
      });
      return deletedUsers;
    } catch (error) {
      console.error('Error fetching soft-deleted users:', error);
      throw new InternalServerErrorException(
        'permission denied',
      );
    }
  }

  async create(createUserDto: CreateCustomerDto, file?: Express.Multer.File) {
    try {
      const existingUser = await this.customerRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });

      if (existingUser) {
        if (existingUser.username === createUserDto.username) {
          throw new ConflictException('Username already exists');
        }

        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('Email already exists');
        }
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await this.s3Service.uploadFile(file);
      }

      const user = this.customerRepository.create({
        ...createUserDto,
        password: hashedPassword,
        image: imageUrl,
      });

      const savedUser = await this.customerRepository.save(user);

      return {
        statusCode: 201,
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      console.error('Error creating customer:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Unexpected server error occurred',
        error: error.message,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateCustomerDto, file?: Express.Multer.File) {
    try {
      const user = await this.customerRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const existingUser = await this.customerRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });
      if (existingUser) {
        if (existingUser.username === updateUserDto.username) {
          return new ConflictException('Username already exists');
        }

        if (existingUser.email === updateUserDto.email) {
          return new ConflictException('Email already exists');
        }
      }
      let imageUrl: string | null = user.image;
      if (file) {
        imageUrl = await this.s3Service.uploadFile(file);
      }

      Object.assign(user, {
        ...updateUserDto,
        image: imageUrl,
        updatedAt: new Date(),
      });

      const savedUser = await this.customerRepository.save(user);

      return { message: 'User updated successfully', data: savedUser };
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new InternalServerErrorException(`Error updating user with ID ${id}`);
    }
  }

  async remove(id: string, customerId: any) {
    try {
      const user = await this.customerRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (user.deletedAt !== null) {
        throw new ConflictException('User has already been soft deleted');
      }

      const result = await this.customerRepository.softDelete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return { message: 'User soft deleted successfully' };

    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);

      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      throw new ForbiddenException('You do not have permission to delete customer');
    }
  }

  async restore(id: string) {
    try {
      const result = await this.customerRepository.restore(id);

      if (result.affected === 0) {
        throw new NotFoundException(
          `User with ID ${id} not found or not deleted`,
        );
      }

      return { message: 'User restored successfully' };
    } catch (error) {
      console.error(`Error restoring user with ID ${id}:`, error);
      throw new InternalServerErrorException(
        `Error restoring user with ID ${id}`,
      );
    }
  }
}
