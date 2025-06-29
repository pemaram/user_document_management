import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DocumentEntity, DocDocument, DocumentStatus } from 'src/documents/entities/document.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly docModel: Model<DocDocument>,
    private readonly httpService: HttpService,
  ) { }

  async triggerIngestion(documentId: string, user: User) {
    const document = await this.docModel.findById(documentId);
    if (!document) throw new NotFoundException('Document not found');

    if (
      document.status === DocumentStatus.PROCESSING ||
      document.status === DocumentStatus.COMPLETED
    ) {
      throw new BadRequestException('Ingestion already in progress or completed');
    }

    document.status = DocumentStatus.PROCESSING;
    document.startedAt = new Date();
    document.ingestionAttempts += 1;
    await document.save();

    try {
      await lastValueFrom(
        this.httpService.post('http://python-service/ingest', {
          documentId: document._id,
          fileUrl: document.path,
        }),
      );
    } catch (error) {
      document.status = DocumentStatus.FAILED;
      await document.save();
      throw new InternalServerErrorException('Failed to trigger ingestion process');
    }

    return { message: 'Ingestion triggered successfully' };
  }

  async getStatus(documentId: string) {
    const document = await this.docModel.findById(documentId);
    if (!document) throw new NotFoundException('Document not found');

    return {
      documentId: document._id,
      status: document.status,
      startedAt: document.startedAt,
      completedAt: document.completedAt,
      result: document.ingestionResult || null,
      attempts: document.ingestionAttempts,
    };
  }

  async handleCallback(data: {
    documentId: string;
    success: boolean;
    result: any;
  }) {
    const { documentId, success, result } = data;
    const doc = await this.docModel.findById(documentId);
    if (!doc) return;

    doc.status = success ? DocumentStatus.COMPLETED : DocumentStatus.FAILED;
    doc.completedAt = new Date();
    doc.ingestionResult = result;
    await doc.save();

    return { message: 'Ingestion result recorded' };
  }
}
