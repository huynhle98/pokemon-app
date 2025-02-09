import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:pokemonId')
  async addFavorite(
    @Param('pokemonId') pokemonId: string,
    @Body('userId') userId: string,
  ) {
    return this.authService.addFavorite(userId, pokemonId);
  }

  // Unmark Pokémon as favorite
  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:pokemonId')
  async removeFavorite(
    @Param('pokemonId') pokemonId: string,
    @Body('userId') userId: string,
  ) {
    return this.authService.removeFavorite(userId, pokemonId);
  }

  // Get all favorite Pokémon of a user
  @UseGuards(JwtAuthGuard)
  @Get('favorites/:userId')
  async getFavorites(@Param('userId') userId: string) {
    return this.authService.getFavorites(userId);
  }
}
