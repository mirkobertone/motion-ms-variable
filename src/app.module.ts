import { Module } from '@nestjs/common';
import { VariablesModule } from './variables/variables.module';
import { MySqlModule } from './connections/mysql.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongoModule } from './connections/mongo.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersPrismaModule } from './users-prisma/users-prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MYSQL_PORT: Joi.number().required(),
        PORT: Joi.number().required(),
        MYSQL_USER: Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DEFAULT_DB: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        HOST: Joi.string().required(),
        MONGO_DEFAULT_DB: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
    VariablesModule,
    UsersModule,
    MySqlModule,
    MongoModule,
    PrismaModule,
    UsersPrismaModule,
  ],
})
export class AppModule {}
