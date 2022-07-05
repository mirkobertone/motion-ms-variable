import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Variable } from './variable.entity';
import { DataSource, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { MYSQL_CONNECTION } from 'src/connections/mysql.module';
import { intersection, keys, pick } from 'lodash';
import { VARIABLES_SERVICE } from 'src/constants/services';

@Injectable()
export class VariablesService {
  private variableRepository: Repository<Variable>;
  constructor(
    @Inject(MYSQL_CONNECTION) private connection: DataSource,
    @Inject(VARIABLES_SERVICE) private readonly client: ClientProxy,
  ) {
    this.variableRepository = this.connection.getRepository(Variable);
  }

  async all(
    query: any,
    paginateOptions: {
      limit: number;
      offset: number;
    },
  ) {
    const columns = this.variableRepository.metadata.columns.map(
      (c) => c.propertyName,
    );
    const queryParamskeys = keys(query);
    const filters = intersection(columns, queryParamskeys);
    const where = pick(query, filters);
    const sort = query.sort;
    console.log(paginateOptions);
    const count = await this.variableRepository
      .createQueryBuilder()
      .where(where)
      .getCount();
    const rows = await this.variableRepository
      .createQueryBuilder()
      .where(where)
      .orderBy(sort)
      .offset(paginateOptions.offset)
      .limit(paginateOptions.limit)
      .getMany();
    return {
      count,
      rows,
    };
  }

  async create(data: {
    name?: string;
    description?: string;
  }): Promise<Variable> {
    const entity = Object.assign(new Variable(), data);
    return this.variableRepository.save(entity);
  }

  async get(id: number): Promise<Variable> {
    try {
      return await this.variableRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(
        {
          code: HttpStatus.NOT_FOUND,
          message: 'Not found.',
          details: {
            code: HttpStatus.NOT_FOUND,
            type: 'NotFound',
          },
        },
        'Entity Not Found.',
      );
    }
  }

  async update(id: number, data) {
    const entity = await this.variableRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Entity not Found.',
        },
        'Entity Not Found.',
      );
    }
    return await this.variableRepository.save(Object.assign(entity, data));
  }

  async delete(id: string) {
    return this.variableRepository.delete(id);
  }
}
