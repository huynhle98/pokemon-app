import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, default: () => uuidv4() })
  id?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, unique: true })
  email?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pokemon' }], default: [] })
  favoritePokemons?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
