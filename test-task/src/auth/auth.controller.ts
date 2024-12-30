import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';

import { LoginDto } from 'src/user/dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // @Post('signup')
  // @ApiOperation({ summary: 'Register a new user' })
  // @ApiResponse({ status: 201, description: 'User registered successfully' })
  // @ApiResponse({ status: 400, description: 'Bad request, validation failed' })
  // signup(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.register(createUserDto);
  // }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { Access_token: token }
}
}
