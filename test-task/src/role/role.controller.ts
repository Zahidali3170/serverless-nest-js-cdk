import { Controller, Post, Get, Body, UseGuards, Delete, Param, Put, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleDto, UpdateRoleDto } from './dto/assign-role.dto';
import { AllRolesGuard } from 'src/auth/all-roles.guard';

@ApiTags('Super Admin / roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RoleDto })
  @ApiBearerAuth()
  @Post()
  async create(@Body() roleDto: RoleDto, @Req() req) {
    return this.roleService.create(roleDto, req.user.role);
  }
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get()
  async findAll(@Req() req) {
    return this.roleService.findAll(req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Delete a Role by ID' })
  @ApiResponse({ status: 200, description: ' deleted Role' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiBearerAuth()
  deleteRole(@Param('id') id: string, @Req() req) {
    return this.roleService.removeRole(id, req.user.role);
  }
  

  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiBearerAuth()
  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() roleDto: UpdateRoleDto, @Req() req) {

    return this.roleService.updateRole(id, roleDto, req.user.role);
  }
}
