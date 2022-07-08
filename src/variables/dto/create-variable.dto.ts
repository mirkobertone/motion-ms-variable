import { ApiProperty } from '@nestjs/swagger';

export class CreateVariableDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
