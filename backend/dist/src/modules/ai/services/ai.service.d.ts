import { PrismaService } from 'src/prisma/prismaservice';
import { AiAnalysisResponseDto } from '../dtos/ai-analysis.dto';
export declare class AiService {
    private prisma;
    private genAI;
    private model;
    constructor(prisma: PrismaService);
    getStoredAnalysis(childId: string): Promise<AiAnalysisResponseDto | null>;
    runCalculationAndAi(childId: string): Promise<AiAnalysisResponseDto>;
    private getAiAdvice;
}
