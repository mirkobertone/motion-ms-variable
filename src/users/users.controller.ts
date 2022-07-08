import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USERS_SERVICE } from 'src/constants/services';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(USERS_SERVICE) private client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const taskObs = this.client.send('users.create', { userId: user.id });
    // try {
    //   const task = await firstValueFrom(taskObs);
    //   console.log('Task created ', task.id);
    // } catch (error) {
    //   console.log('Error communication for task creation', error);
    // }
    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
