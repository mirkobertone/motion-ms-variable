import { Module } from '@nestjs/common';
import { VariablesController } from './variables.controller';
import { VariablesService } from './variables.service';
import { RmqModule } from 'src/transports/rmq/rmq.module';
import { BILLING_SERVICE } from 'src/constants/services';

@Module({
  imports: [
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
  ],
  controllers: [VariablesController],
  providers: [VariablesService],
})
export class VariablesModule {}
