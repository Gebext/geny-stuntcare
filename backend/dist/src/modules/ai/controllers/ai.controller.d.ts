import { AiAnalysisResponseDto } from '../dtos/ai-analysis.dto';
import { AiService } from '../services/ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getAnalysis(childId: string): Promise<AiAnalysisResponseDto | null>;
    triggerAnalysis(childId: string): Promise<AiAnalysisResponseDto>;
}
