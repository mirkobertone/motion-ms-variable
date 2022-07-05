import { BadRequestException, Global, Module, Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { createDatabase } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { Variable } from 'src/variables/variable.entity';

const TENANT_HEADER = 'x-tenant-id';
export const TENANT_CONNECTION = 'TENANT_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: TENANT_CONNECTION,
      inject: [REQUEST, ConfigService],
      scope: Scope.REQUEST,
      useFactory: async (request, configService: ConfigService) => {
        const tenantId =
          (request.headers[TENANT_HEADER] as string) ||
          configService.get<string>('MYSQL_DEFAULT_DB');
        if (!tenantId) {
          throw new BadRequestException(
            'Database Connection Error',
            'TenantId not provided in header x-tenant-id',
          );
        }
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
  exports: [TENANT_CONNECTION],
})
export class TenancyModule {}
