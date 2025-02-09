import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PokemonsService } from 'src/services/pokemons.service';
import { Pokemon } from '../schemas/pokemon.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetPokemonsDto } from 'src/dtos/get-pokemons.dto';

@Controller('api/pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  // 📌 API: Tạo một Pokémon mới
  @Post()
  async create(@Body() pokemonData: Pokemon): Promise<Pokemon> {
    return this.pokemonsService.create(pokemonData);
  }

  // 📌 API: Lấy danh sách tất cả Pokémon
  @Get()
  async findAll(@Query() query: GetPokemonsDto) {
    const { totalPokemons, data } = await this.pokemonsService.findAll(query);
    return {
      totalPokemons,
      data,
    };
  }

  @Get('details/:id')
  async getPokemonById(@Param('id') id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonsService.findById(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokémon with ID ${id} not found.`);
    }
    return pokemon;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to store files
        filename: (req, file, callback) => {
          const fileName = Date.now() + extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const pokemons: Pokemon[] = [];

    // Ensure file path is correct and exists
    const filePath = file.path;
    if (!filePath) {
      return res.status(400).json({ message: 'File path is missing.' });
    }
    // Read the uploaded CSV file
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.replace(/['"]+/g, '').trim(), // Remove any surrounding quotes from headers
        }),
      )
      .on('data', async (row) => {
        // const hasPokemon = await this.pokemonsService.checkIfPokemonExists(
        //   String(row.id),
        // );
        // if (!hasPokemon) {
        pokemons.push({
          id: String(row.id),
          name: row.name,
          type1: row.type1,
          type2: row.type2 || null,
          total: Number(row.total),
          legendary: row.legendary === 'true',
          hp: Number(row.hp),
          attack: Number(row.attack),
          defense: Number(row.defense),
          spAttack: Number(row.spAttack),
          spDefense: Number(row.spDefense),
          speed: Number(row.speed),
          generation: Number(row.generation),
          image: row.image,
          ytbUrl: row.ytbUrl || null,
          isFavorite: false,
        });
      })

      .on('end', async () => {
        try {
          // Save Pokémon data to the database
          await this.pokemonsService.createMany(pokemons);
          res
            .status(200)
            .json({ message: 'Pokémon data imported successfully.' });
        } catch (error) {
          res
            .status(500)
            .json({ message: 'Error importing Pokémon data.', error });
        }
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Error reading the file.', error });
      });
  }

  @Get('types')
  async getAllPokemonTypes() {
    return this.pokemonsService.getAllUniqueTypes();
  }
}
