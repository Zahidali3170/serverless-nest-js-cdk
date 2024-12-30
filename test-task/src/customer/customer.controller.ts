import { Controller, Get, Post, Body, Param, UseGuards, Delete, Req, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { CustomerService } from './customer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllRolesGuard } from 'src/auth/all-roles.guard';
export const rolesArrays = ['Admin', 'Editor', 'superman'];
import { Customer } from './customer.entity';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {

  constructor(private readonly customerervice: CustomerService,
  ) { }

  @Get('all-customer')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get all customer' })
  @ApiResponse({ status: 200, description: 'List of all customer' })
  @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  @ApiBearerAuth()
  async getCustomer(@Req() req) {
    const customerId: any = req;
    return this.customerervice.findAll(customerId);
  }
  @Get('customer-profile')
  @ApiOperation({ summary: 'Customer profile' })
  @ApiResponse({ status: 200, description: 'Customer profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCustomerProfile(@Req() req): Promise<Customer> {
    const customerId: any = req;
    return this.customerervice.findProfile(customerId.user.id);
  }

  @Post('create-customer')
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

  @Put('update-customer/:id')
  @ApiOperation({ summary: 'Update a customer with image upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
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
    return this.customerervice.update(customerId.user.id, updateUserDto, file);
  }

  @Get('customer/:id')
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  @ApiOperation({ summary: 'Get a Customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getCustomerById(@Param('id') id: string, @Req() req) {
    const customerId: any = req;
    return this.customerervice.findById(id, customerId);
  }

  @Delete('delete-customer/:id')
  @ApiOperation({ summary: 'Delete a Customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AllRolesGuard)
  deleteCustomer(@Req() req, @Param('id') id: string) {
    const createdBy: any = req;
    return this.customerervice.remove(id, createdBy);
  }
}

