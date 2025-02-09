// src/pokemons/dto/get-pokemons.dto.ts
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GetPokemonsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  legendary?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  minSpeed?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  maxSpeed?: string;

  @IsOptional()
  @IsNumber()
  limit: number = 20; // Default to 20 Pokémon per page

  @IsOptional()
  @IsNumber()
  offset: number = 0; // Default offset (page starts from 0)
}
