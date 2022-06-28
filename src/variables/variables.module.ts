import { Module } from '@nestjs/common';
import { VariablesController } from './variables.controller';
import { VariablesService } from './variables.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VARIABLE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://vzivjkde:noOAzBnmdixLwto4znmv6tYtLRRfF7Or@beaver.rmq.cloudamqp.com/vzivjkde',
          ],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [VariablesController],
  providers: [VariablesService],
})
export class VariablesModule {}
