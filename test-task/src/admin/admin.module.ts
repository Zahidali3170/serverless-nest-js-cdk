import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Role } from 'src/role/role.entity';
import { Admin } from 'src/user/admin.entity';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([Role, Admin]),RoleModule, forwardRef(()=>UserModule) ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

