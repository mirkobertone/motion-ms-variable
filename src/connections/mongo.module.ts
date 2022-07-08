import { Global, Module, Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';

const TENANT_HEADER = 'x-tenant-id';
export const MONGO_CONNECTION = 'MONGO_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: MONGO_CONNECTION,
      inject: [REQUEST, ConfigService],
      scope: Scope.REQUEST,
      useFactory: async (request, configService: ConfigService) => {
        const tenantId =
          (request.headers[TENANT_HEADER] as string) ||
          configService.get<string>('MONGO_DEFAULT_DB');
        const options: DataSourceOptions = {
          name: tenantId,
          type: 'mongodb',
          url: `${configService.get<string>('MONGODB_URI')}`,
          entities: [User],
          synchronize: false,
          database: `${tenantId}`,
        };
        const dataSource = new DataSource(options);
        return await dataSource.initialize();
      },
    },
  ],
  exports: [MONGO_CONNECTION],
})
export class MongoModule {}
