import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 📌 Signup: Hash password and create user
  async signup(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      username,
      password: hashedPassword,
    });
  }

  // 📌 Login: Validate user and return JWT
  async login(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Generate JWT Token
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
