import { Global, Module, Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { createDatabase } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { Variable } from 'src/variables/variable.entity';

const TENANT_HEADER = 'x-tenant-id';
export const MYSQL_CONNECTION = 'MYSQL_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: MYSQL_CONNECTION,
      inject: [REQUEST, ConfigService],
      scope: Scope.REQUEST,
      useFactory: async (request, configService: ConfigService) => {
        const tenantId =
          (request.headers[TENANT_HEADER] as string) ||
          configService.get<string>('MYSQL_DEFAULT_DB');
        const options: DataSourceOptions = {
          type: 'mysql',
          host: configService.get<string>('HOST'),
          port: configService.get<number>('MYSQL_PORT'),
          username: configService.get<string>('MYSQL_USER'),
          password: configService.get<string>('MYSQL_PASSWORD'),
          entities: [Variable],
          synchronize: false,
          database: `${tenantId}`,
          logging: ['error'],
        };
        await createDatabase({
          options,
          ifNotExist: true,
        });
        const dataSource = new DataSource(options);
        return await dataSource.initialize();
      },
    },
  ],
  exports: [MYSQL_CONNECTION],
})
export class MySqlModule {}

