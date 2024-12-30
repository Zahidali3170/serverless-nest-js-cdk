import { Controller, Get, Post, Body, Param, UseGuards, Delete, Req, Put, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

import { CreateSuperAdminDto, UpdateUserDto } from './dto/admin.dto';
import { AllRolesGuard } from 'src/auth/all-roles.guard';

@ApiTags('Super Admin')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get()
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getUsers(@Req() req) {
    return this.userService.findAll(req.user.role);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Create a new users' })
  @ApiBody({ type: CreateSuperAdminDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  createUser(@Body() createUserDto: CreateSuperAdminDto, @Req() req) {
    return this.userService.create(createUserDto, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get a users by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  getUserById(@Param('id') id: string, @Req() req) {
    return this.userService.findById(id, req.user.role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const createdBy: any = req;
    return this.userService.update(id, updateUserDto, req.user.role);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  deleteUser(@Param('id') id: string, @Req() req: any,) {
    return this.userService.remove(id, req.user.role);
  }

  @ApiOperation({ summary: 'Assign a role to an users' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'users or Role not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @Patch(':userId/role/:roleId')
  async assignRole(
    @Param('userId') adminId: string,
    @Param('roleId') roleId: string,
    @Req() req: any,
  ) {
    return this.userService.assignRole(adminId, roleId, req.user.role);
  }
}
