import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { FavoritesService } from 'src/services/favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId/:pokemonId')
  async addFavorite(
    @Param('userId') userId: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.favoritesService.addFavorite(userId, pokemonId);
  }

  @Delete(':userId/:pokemonId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.favoritesService.removeFavorite(userId, pokemonId);
  }

  @Get(':userId')
  async getUserFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getUserFavorites(userId);
  }
}
