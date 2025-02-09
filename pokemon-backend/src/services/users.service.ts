import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    // Check if the username already exists in the database
    const existingUser = await this.userModel.findOne({
      username: user.username,
    });
    if (existingUser) {
      // Throw a custom error if username already exists
      throw new ConflictException('Username is already taken');
    }

    // Proceed with creating and saving the user if no conflict
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel
      .findOne({ username })
      .populate('favoritePokemons')
      .exec();
  }
}
