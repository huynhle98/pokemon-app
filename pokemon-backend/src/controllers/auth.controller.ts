import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 📌 Signup Endpoint
  @Post('signup')
  async signup(@Body() body: { username: string; password: string }) {
    return this.authService.signup(body.username, body.password);
  }

  // 📌 Login Endpoint
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
