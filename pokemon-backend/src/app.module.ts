import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsController } from './controllers/pokemons.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';
import { PokemonsService } from './services/pokemons.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, PokemonsController],
  providers: [AppService, PokemonsService],
})
export class AppModule {}
