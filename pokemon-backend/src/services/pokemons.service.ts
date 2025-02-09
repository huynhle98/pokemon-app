import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonDocument } from '../schemas/pokemon.schema';
import { GetPokemonsDto } from 'src/dtos/get-pokemons.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
  ) {}

  async create(pokemon: Pokemon): Promise<Pokemon> {
    return new this.pokemonModel(pokemon).save();
  }

  // Save multiple Pokémon records to the database
  async createMany(pokemons: Pokemon[]): Promise<Pokemon[]> {
    return this.pokemonModel.insertMany(pokemons);
  }

  async findAll(query: GetPokemonsDto) {
    const filter: any = {};
    // Apply filters
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' }; // Case-insensitive search for name
    }
    if (query.type) {
      filter.$or = [{ type1: query.type }, { type2: query.type }];
    }
    if (!(!query.legendary || !this.isNotNullOrUndefined(query.legendary))) {
      filter.legendary = Boolean(query.legendary);
    }

    filter.speed = {
      $gte:
        !query.minSpeed || !this.isNotNullOrUndefined(query.minSpeed)
          ? 1
          : Number(query.minSpeed) || 1,
      $lte:
        !query.maxSpeed || !this.isNotNullOrUndefined(query.maxSpeed)
          ? 500
          : Number(query.maxSpeed) || 500,
    };

    // Fetch Pokémon with pagination
    const pokemons = await this.pokemonModel
      .find(filter)
      .skip(query.offset || 0)
      .limit(query.limit);

    const totalPokemons = await this.pokemonModel.countDocuments(filter);

    return { totalPokemons, data: pokemons };
  }

  isNotNullOrUndefined(value: string): boolean {
    return !(value === 'undefined' || value === 'null');
  }

  async checkIfPokemonExists(id: string): Promise<boolean> {
    const pokemon = await this.pokemonModel.findOne({ id });
    return !!pokemon; // Return true if exists, false otherwise
  }

  async getAllUniqueTypes(): Promise<string[]> {
    const types1 = await this.pokemonModel.distinct('type1').exec();
    const types2 = await this.pokemonModel.distinct('type2').exec();

    const uniqueTypes = new Set([...types1, ...types2]);
    return Array.from(uniqueTypes).filter(Boolean); // Remove null/undefined values
  }

  async findById(id: string): Promise<Pokemon | null> {
    return this.pokemonModel.findOne({ id }).exec();
  }
}
