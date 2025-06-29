import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateIngestionDto {}

export class TriggerIngestionDto {
  @ApiProperty({ example: '665d16f89c55f4573efadf13' })
  @IsMongoId()
  documentId: string;
}