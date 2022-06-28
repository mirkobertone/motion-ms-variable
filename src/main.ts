import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
// import { tenancyMiddleware } from './modules/tenancy/tenancy.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
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
  });
  app.startAllMicroservices();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
}

bootstrap();
