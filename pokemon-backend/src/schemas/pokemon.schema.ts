import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type1: string;

  @Prop({ required: false })
  type2: string;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, default: false })
  legendary: boolean;

  @Prop({ required: true })
  hp: number;

  @Prop({ required: true })
  attack: number;

  @Prop({ required: true })
  defense: number;

  @Prop({ required: true })
  spAttack: number;

  @Prop({ required: true })
  spDefense: number;

  @Prop({ required: true })
  speed: number;

  @Prop({ required: true })
  generation: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  ytbUrl?: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
