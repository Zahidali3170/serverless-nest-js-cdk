import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from './permission.entity';
// import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { RoleModule } from 'src/role/role.module';
import { Admin } from 'src/user/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission,Admin]),RoleModule],
  // controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
