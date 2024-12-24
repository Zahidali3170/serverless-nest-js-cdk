import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { RoleDto } from 'src/role/dto/assign-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { SuperRole } from 'src/user/enum/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { AllRolesGuard } from 'src/auth/all-roles.guard';
;


@ApiTags('Users')
@Controller('user')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }


  @Get()
  // @Roles(SuperRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all assign roles only Super admin' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  getCustomer(@Req() req) {
    return this.adminService.findAll(req.user.role);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the profile of the specified user',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiBearerAuth()
  async getUserProfile(@Req() req){
    console.log("********* user5 profile", req.user.id)
    return this.adminService.getUserProfile(req.user.id);
  }
}
