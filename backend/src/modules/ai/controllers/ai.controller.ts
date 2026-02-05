import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AiService } from '../services/ai.service';

@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Get(':childId')
  async getAnalysis(@Param('childId') childId: string) {
    this.logger.log(`[GET] Request data analisis untuk: ${childId}`);
    // Langsung return service, biarkan Interceptor global yang membungkus sekali saja
    return this.aiService.getStoredAnalysis(childId);
  }

  @Post('trigger/:childId')
  async triggerAnalysis(@Param('childId') childId: string) {
    this.logger.log(`[POST] Menjalankan trigger AI untuk: ${childId}`);
    // Sama seperti GET, jangan dibungkus manual lagi
    return this.aiService.runCalculationAndAi(childId);
  }
}
