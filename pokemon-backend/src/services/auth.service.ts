import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/schemas/pokemon.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 📌 Signup: Hash password and create user
  async signup(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return this.login(username, password);
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

  // Add Pokémon to user's favorites
  async addFavorite(userId: string, pokemonId: string): Promise<Pokemon> {
    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure the Pokémon exists
    const pokemon = await this.pokemonModel.findOne({ id: pokemonId }).exec();
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    pokemon.isFavorite = true;
    await pokemon.save();

    // Add Pokémon to the user's favorites if not already there
    if (!user.favoritePokemons) {
      user.favoritePokemons = [];
    }
    if (!user.favoritePokemons.includes(pokemonId)) {
      user.favoritePokemons.push(pokemonId);
      await user.save();
    }
    return pokemon;
  }

  // Remove Pokémon from user's favorites
  async removeFavorite(userId: string, pokemonId: string): Promise<Pokemon> {
    // Ensure the Pokémon exists
    const pokemon = await this.pokemonModel.findOne({ id: pokemonId }).exec();
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    pokemon.isFavorite = false;
    await pokemon.save();

    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.favoritePokemons) {
      return pokemon;
    }

    const index = user.favoritePokemons.indexOf(pokemonId);
    if (index !== -1) {
      user.favoritePokemons.splice(index, 1);
      await user.save();
    }
    return pokemon;
  }

  // Get user's favorite Pokémon
  async getFavorites(userId: string): Promise<Pokemon[]> {
    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const favoritePokemons = await this.pokemonModel
      .find({ id: { $in: user.favoritePokemons }, isFavorite: true })
      .exec();
    return favoritePokemons;
  }
}
