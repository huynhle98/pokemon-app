import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonsController } from 'src/controllers/pokemons.controller';
import { Pokemon, PokemonSchema } from 'src/schemas/pokemon.schema';
import { PokemonsService } from 'src/services/pokemons.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
  controllers: [PokemonsController],
  providers: [PokemonsService],
  exports: [PokemonsService, MongooseModule],
})
export class PokemonsModule {}
