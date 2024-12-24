import { Controller, Get, Post, Body, Param, UseGuards, Delete, Req, Put, Patch, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

import { Request } from 'express';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomerService } from './customer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Permissions, Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
// import { PermissionGuard } from 'src/auth/permission.guard';
import { SuperRole } from 'src/user/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/role/role.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from 'src/role/role.service';
import { AllRolesGuard } from 'src/auth/all-roles.guard';
export  const rolesArrays = ['Admin', 'Editor', 'superman'];
import {RoleType} from '../auth/role.decorator'

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {

  constructor(private readonly customerervice: CustomerService, 
    private readonly roleService: RoleService
  ) { }

  async getDynamicRoles(){
    console.log(this.roleService.getDynamicRoles())
    return this.roleService.getDynamicRoles(); 
  }
  //
  //[ 'Admin', 'Admin', 'Editor', 'admin', 'superman' ]
  // private getDynamicRoles = () => this.roleService!.getDynamicRoles();
 
  @Get()
  // @Roles(SuperRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all customer' })
  @ApiResponse({ status: 200, description: 'List of all customer' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  async getCustomer(@Req() req) {
    const customerId: any = req;
    console.log(customerId.user.role)
    return this.customerervice.findAll(customerId);
  }
  @Get('profile')
  @ApiOperation({ summary: 'Customer profile' })
  @ApiResponse({ status: 200, description: 'Customer profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCustomerProfile(@Req() req) {
    const customerId: any = req;
    return this.customerervice.findProfile(customerId.user.id);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new customer with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation failed',
  })
  @ApiBody({
    description: 'Create a new customer with image upload',
    type: CreateCustomerDto,
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      // Only allow certain image types
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files allowed'), false);
      }
      cb(null, true);
    },
  }))
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.customerervice.create(createCustomerDto, file);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer with image upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      // Only allow certain image types
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateCustomer(
    @Req() req,
    @Body() updateUserDto: UpdateCustomerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const customerId: any = req;
    console.log("****************",customerId.user)

    return this.customerervice.update(customerId.user.id, updateUserDto, file);
  }

  @Get(':id')
  // @Roles(SuperRole.SUPER_ADMIN, 'Admin','Editor')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get a Customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getCustomerById(@Param('id') id: string,@Req() req) {
    const customerId: any = req;
    return this.customerervice.findById(id,customerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,AllRolesGuard)
  deleteCustomer(@Req() req,@Param('id') id: string) {
    const createdBy: any = req;
    console.log(createdBy.user)
    return this.customerervice.remove(id,createdBy);
  }
}

