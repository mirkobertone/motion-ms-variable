import { Module } from '@nestjs/common';
import { USERS_SERVICE } from 'src/constants/services';
import { RmqModule } from 'src/transports/rmq/rmq.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    RmqModule.register({
      name: USERS_SERVICE,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
