import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from '../schemas/favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async addFavorite(userId: string, pokemonId: string): Promise<Favorite> {
    return new this.favoriteModel({ user: userId, pokemon: pokemonId }).save();
  }

  async removeFavorite(userId: string, pokemonId: string): Promise<void> {
    await this.favoriteModel
      .deleteOne({ user: userId, pokemon: pokemonId })
      .exec();
  }

  async getUserFavorites(userId: string) {
    return this.favoriteModel.find({ user: userId }).populate('pokemon').exec();
  }
}
