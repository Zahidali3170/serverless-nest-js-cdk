// import { Permission } from 'src/permission/permission.entity';
// import { Admin } from 'src/user/admin.entity';
// import { Customer } from 'src/customer/customer.entity';
// import { Role } from 'src/role/role.entity';
// import { User } from 'src/user/user.entity';
// import { DataSource } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

// config();

// const configService = new ConfigService();
// const databaseUrl = configService.get<string>('DATABASE_URL');

// if (!databaseUrl) {
//   throw new Error('DATABASE_URL is not defined in the environment');
// }
// export default new DataSource({
//    type: 'postgres',
//      url: databaseUrl,
//      entities: [User, Role, Permission, Admin, Customer],
//      synchronize: false,
//      migrations: ['src/migrations/*.ts'],
//      migrationsTableName: 'migrations',
//      ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
//      logging: true,
// });