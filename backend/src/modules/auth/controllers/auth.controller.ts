import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    // Support both 'email' (legacy) and 'identifier' fields
    const identifier = body.email || body.identifier;
    return this.authService.login(identifier, body.password);
  }
}