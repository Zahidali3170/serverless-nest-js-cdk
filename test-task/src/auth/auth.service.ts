// auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';
import { User } from 'src/user/user.entity';
import { SuperRole } from 'src/user/enum/role.enum';
import { Admin } from 'src/user/admin.entity';
import { Customer } from 'src/customer/customer.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService
  ) {}

  // async register(createUserDto: CreateUserDto): Promise<User> {
  //   const { username, password, roleId } = createUserDto;
  //   if (!username) {
  //     throw new UnauthorizedException('username required');
  //   }
  //   if (!password) {
  //     throw new UnauthorizedException('password required');
  //   }
  //   if (roleId === SuperRole.SUPER_ADMIN) {
  //     const existingSuperAdmin = await this.userRepository.findOne({ where: { role: SuperRole.SUPER_ADMIN } });
  //     if (existingSuperAdmin) {
  //       throw new ConflictException('Superadmin already exists');
  //     }
  //   }

  //   const existingUser = await this.userRepository.findOne({ where: { username } });
  //   if (existingUser) {
  //     throw new ConflictException('Username already exists');
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const user = this.userRepository.create({
  //     username,
  //     password: hashedPassword,
  //     role:roleId,
  //   });

  //   return this.userRepository.save(user);
  // }


  async login(loginDto: LoginDto): Promise<string> {
    const { username, password } = loginDto;

    if (!username || !password) {
      throw new UnauthorizedException('Username and password are required');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const payload = { username: user.username };
      return this.jwtService.sign(payload);
    }

    const customer = await this.customerRepository.findOne({ where: { username } });
    if (customer) {
      const passwordMatches = await bcrypt.compare(password, customer.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const payload = { username: customer.username, sub: customer.id, };
      return this.jwtService.sign(payload);
    }

    const admin = await this.adminRepository.findOne({ where: { username }, relations:['roles'] });
    if (admin) {
      const passwordMatches = await bcrypt.compare(password, admin.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid username or password');
      }

      const payload = { username: admin.username };
      return this.jwtService.sign(payload);
    }

    throw new UnauthorizedException('Invalid username or password');
  }
}
