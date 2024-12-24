import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Permission } from '../permission/permission.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), forwardRef(() => UserModule)],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService,TypeOrmModule.forFeature([Role, Permission])],
})
export class RoleModule {}
