import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserPrismaDto } from './dto/create-prisma-user.dto';

@Injectable()
export class UsersPrismaService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserPrismaDto: CreateUserPrismaDto) {
    const user = await this.prisma.userPrisma.create({
      data: {
        firstName: createUserPrismaDto.firstName,
        lastName: createUserPrismaDto.lastName,
        email: createUserPrismaDto.email,
      },
    });
    return user;
  }
}
