import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { Variable } from './variable.entity';
import { VariablesService } from './variables.service';
import { VARIABLES_SERVICE } from 'src/constants/services';

@Controller('variables')
export class VariablesController {
  constructor(
    private readonly variablesService: VariablesService,
    @Inject(VARIABLES_SERVICE) private client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createVariableDto: CreateVariableDto) {
    return await this.variablesService.create({
      name: createVariableDto.name,
      description: createVariableDto.description,
    });
  }

  @Put(':id')
  async update(
    @Body() updateVariableDto: UpdateVariableDto,
    @Param('id') id: number,
  ) {
    return await this.variablesService.update(id, {
      name: updateVariableDto.name,
      description: updateVariableDto.description,
    });
  }

  @Get()
  async findAll(
    @Query() query = {},
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset = 0,
    @Query('limit', new DefaultValuePipe(250), ParseIntPipe) limit = 250,
  ) {
    // const request = this.client.send('all', {});
    // console.log(await firstValueFrom(request));
    return this.variablesService.all(query, {
      limit,
      offset,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Variable> {
    return this.variablesService.get(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.variablesService.delete(id);
  }

  @EventPattern('hello')
  async hello(data: string) {
    console.log('Hello!');
  }

  @MessagePattern('all')
  async allReq() {
    // return this.variablesService.all();
  }

  @MessagePattern('users.create')
  async userCreated(@Payload() data: number[], @Ctx() context: NatsContext) {
    console.log('users.create received from ', data, context);
    return this.variablesService.create({
      name: 'First Variable',
      description: 'Desc',
    });
  }
}
