import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentEntity, DocumentSchema } from 'src/documents/entities/document.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
    ]),
    HttpModule,
  ],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
