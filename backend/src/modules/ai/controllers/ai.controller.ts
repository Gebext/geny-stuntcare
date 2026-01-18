import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AiAnalysisResponseDto } from '../dtos/ai-analysis.dto';
import { AiService } from '../services/ai.service';

@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get(':childId')
  async getAnalysis(
    @Param('childId') childId: string,
  ): Promise<AiAnalysisResponseDto | null> {
    return this.aiService.getStoredAnalysis(childId);
  }

  @Post('trigger/:childId')
  async triggerAnalysis(
    @Param('childId') childId: string,
  ): Promise<AiAnalysisResponseDto> {
    return this.aiService.runCalculationAndAi(childId);
  }
}
