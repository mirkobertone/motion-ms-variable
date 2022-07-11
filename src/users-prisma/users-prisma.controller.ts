import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserPrismaDto } from './dto/create-prisma-user.dto';
import { UsersPrismaService } from './users-prisma.service';

@Controller('users-prisma')
export class UsersPrismaController {
  constructor(private usersPrismaService: UsersPrismaService) {}

  @Post()
  async create(@Body() createUserPrismaDto: CreateUserPrismaDto) {
    const user = await this.usersPrismaService.createUser(createUserPrismaDto);
    return user;
  }
}
