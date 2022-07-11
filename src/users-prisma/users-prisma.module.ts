import { Module } from '@nestjs/common';
import { UsersPrismaController } from './users-prisma.controller';
import { UsersPrismaService } from './users-prisma.service';

@Module({
  controllers: [UsersPrismaController],
  providers: [UsersPrismaService],
})
export class UsersPrismaModule {}
