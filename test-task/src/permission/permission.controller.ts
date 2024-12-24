// import { Controller, Post, Get, Body, UseGuards, Delete, Param, Req } from '@nestjs/common';
// import { PermissionService } from './permission.service';
// import { Roles } from 'src/auth/role.decorator';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { SuperRole } from 'src/user/enum/role.enum';
// import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
// import { PermissionDto } from './dto/permission.dto';

// @ApiTags('Super Admin -> Permissions') 
// @Controller('permissions')
// export class PermissionController {
//   constructor(private readonly permissionService: PermissionService) {}

//   @Roles(SuperRole.SUPER_ADMIN)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Post()
//   @ApiOperation({ summary: 'Create a new permission' }) 
//   @ApiBody({ description: 'The permission to create', type: PermissionDto })
//   @ApiResponse({ status: 201, description: 'Permission created successfully.' }) 
//   @ApiResponse({ status: 403, description: 'Forbidden. You do not have access to this resource.' }) 
//   @ApiBearerAuth()
//   async create(@Body() permissionDto:PermissionDto,@Req() req:Request) {
//     const createdBy: any = req;
//     return this.permissionService.create(permissionDto,createdBy.user.id);
//   }

//   @Roles(SuperRole.SUPER_ADMIN)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Get()
//   @ApiOperation({ summary: 'Get all permissions' })
//   @ApiResponse({ status: 200, description: 'List of permissions', type: [Object] }) 
//   @ApiResponse({ status: 403, description: 'Forbidden' }) 
//   @ApiBearerAuth()
//   async findAll(@Req() req:Request) {
//     const createdBy: any = req;
//     console.log(createdBy.user.username)
//     return this.permissionService.findAll(createdBy.id);
//   }

//   @Delete(':id')
//   @Roles(SuperRole.SUPER_ADMIN)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @ApiOperation({ summary: 'Delete a permissions by ID' })
//   @ApiResponse({ status: 200, description: ' deleted permissions' })
//   @ApiResponse({ status: 404, description: 'permissions not found' })
//   @ApiBearerAuth()
//   deleteUser(@Param('id') id: string, @Req() req:Request) {
//     const createdBy: any = req;
//     return this.permissionService.removePermission(id,createdBy.id);
//   }
// }
