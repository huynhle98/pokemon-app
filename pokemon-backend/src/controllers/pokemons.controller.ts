import { Body, Controller, Get, Post } from '@nestjs/common';
import { PokemonsService } from 'src/services/pokemons.service';
import { Pokemon } from '../schemas/pokemon.schema';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  // 📌 API: Tạo một Pokémon mới
  @Post()
  async create(@Body() pokemonData: Pokemon): Promise<Pokemon> {
    return this.pokemonsService.create(pokemonData);
  }

  // 📌 API: Lấy danh sách tất cả Pokémon
  @Get()
  async findAll(): Promise<Pokemon[]> {
    return this.pokemonsService.findAll();
  }

  // 📌 API: Lấy thông tin một Pokémon theo ID
  //   @Get(':id')
  //   async findOne(@Param('id') id: string): Promise<Pokemon> {
  //     return this.pokemonsService.findById(id);
  //   }
}
