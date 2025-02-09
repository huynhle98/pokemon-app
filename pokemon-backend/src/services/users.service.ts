import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/schemas/pokemon.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(user: User): Promise<User> {
    // Check if the username already exists in the database
    const existingUser = await this.userModel.findOne({
      username: user.username,
    });
    if (existingUser) {
      // Throw a custom error if username already exists
      throw new ConflictException('Username is already taken');
    }

    // Proceed with creating and saving the user if no conflict
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel
      .findOne({ username })
      .populate('favoritePokemons')
      .exec();
  }

  // Remove Pokémon from user's favorites
  // async removeFavorite(userId: string, pokemonId: string): Promise<User> {
  //   const user = await this.userModel.findById(userId).exec();
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const index = user.favorites.indexOf(pokemonId);
  //   if (index !== -1) {
  //     user.favorites.splice(index, 1);
  //     await user.save();
  //   }
  //   return user;
  // }

  // // Get user's favorite Pokémon
  // async getFavorites(userId: string): Promise<Pokemon[]> {
  //   const user = await this.userModel.findById(userId).exec();
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const favoritePokemons = await this.pokemonModel
  //     .find({ _id: { $in: user.favorites } })
  //     .exec();
  //   return favoritePokemons;
  // }
}
