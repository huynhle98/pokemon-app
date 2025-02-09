import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { User } from '../schemas/user.schema';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 📌 API: Tạo một user mới
  @Post()
  async create(@Body() userData: User): Promise<User> {
    return this.usersService.create(userData);
  }

  // 📌 API: Lấy thông tin user theo username
  @Get(':username')
  async findUser(@Param('username') username: string): Promise<User | null> {
    return this.usersService.findUserByUsername(username);
  }
  // Mark Pokémon as favorite
}
