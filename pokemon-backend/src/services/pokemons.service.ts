import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonDocument } from '../schemas/pokemon.schema';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
  ) {}

  async create(pokemon: Pokemon): Promise<Pokemon> {
    return new this.pokemonModel(pokemon).save();
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonModel.find().exec();
  }
}
