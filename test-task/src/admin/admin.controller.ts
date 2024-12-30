import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllRolesGuard } from 'src/auth/all-roles.guard';

@ApiTags('Users')
@Controller('user')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('all-roles')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all assign roles only Super admin' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  getCustomer(@Req() req) {
    return this.adminService.findAll(req.user.role);
  }

  @Get('user-profile')
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
    return this.adminService.getUserProfile(req.user.id);
  }
}
