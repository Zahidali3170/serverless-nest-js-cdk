import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { User } from '../user/user.entity';
import { Customer } from 'src/customer/customer.entity';
import { Admin } from 'src/user/admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any): Promise<User | Customer| Admin| { error: string }> {
    const { sub } = payload;
    const user = await this.userRepository.findOne({ where: { id: sub } }); 
    const customer = await this.customerRepository.findOne({ where: { id: sub } });
    const admin = await this.adminRepository.findOne({ where: { id: sub },relations: ['roles'] });
    if (admin) {
      return admin; 
    }
    if (customer) {
      return customer; 
    }
    if (!user) {
      throw new UnauthorizedException('Permission denied');
    }
    return user; 
  }
}
