// user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PermissionModule } from 'src/permission/permission.module';
import { AdminModule } from 'src/admin/admin.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]),PermissionModule,AdminModule,RoleModule, forwardRef(() => UserModule) ],
  providers: [CustomerService],
  exports: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

