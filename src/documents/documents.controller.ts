import { Body, Controller, Post, UploadedFile, UseInterceptors, UseGuards, Req, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { RolesGuard } from '../common/roles.guard';
import { CreateDocumentDto ,UploadFileDto} from './dto/create-document.dto';
import { File } from 'multer';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DocumentsController {
  constructor(private docService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  async upload(@UploadedFile() file: File, @Req() req) {
    const dto: CreateDocumentDto = {
      name: file.originalname,
      path: file.path,
      uploadedBy: req.user.email,
      status: 'uploaded',
    };
    return this.docService.create(dto);
  }

  @Get()
  findAll() {
    return this.docService.findAll();
  }
}
