import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';
import { Admin } from '../user/admin.entity';
import { Customer } from '../customer/customer.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in the environment');
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [User, Role, Permission, Admin, Customer],
    synchronize: true,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
    // logging: true,
  };
};
