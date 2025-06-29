import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uploadedBy: string;

  @ApiProperty({ enum: ['uploaded', 'processing', 'completed', 'failed'], default:"uploaded"  })
  status: string;
}

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  file: any;
}
