import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TriggerIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Ingestion')
@Controller('ingestion')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin', 'editor')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiBody({ type: TriggerIngestionDto })
  async trigger(
    @Body() body: TriggerIngestionDto,
    @Req() req: any
  ) {
    return this.ingestionService.triggerIngestion(body.documentId, req.user);
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    return this.ingestionService.getStatus(id);
  }

  @Post('callback')
  async callback(@Body() body: any) {
    return this.ingestionService.handleCallback(body);
  }
}

