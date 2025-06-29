import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity, DocDocument } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(DocumentEntity.name) private docModel: Model<DocDocument>) {}

  async create(documentDTO: CreateDocumentDto) {
    const doc = new this.docModel({...documentDTO, });
    return doc.save();
  }

  async findAll() {
    return this.docModel.find();
  }
}