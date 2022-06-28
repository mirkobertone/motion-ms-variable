import { Module } from '@nestjs/common';
import { VariablesModule } from './variables/variables.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SQL_PORT: Joi.number().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        HOST: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
    VariablesModule,
    TenancyModule,
  ],
})
export class AppModule {}