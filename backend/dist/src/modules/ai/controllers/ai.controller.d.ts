import { AiService } from '../services/ai.service';
export declare class AiController {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AiService);
    getAnalysis(childId: string): Promise<{
        id: string;
        childId: string;
        score: number;
        zScore: number;
        status: string;
        summary: string;
        weightScore: number;
        heightScore: number;
        nutritionScore: number;
        sanitationScore: number;
        immunizationScore: number;
        recommendations: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    triggerAnalysis(childId: string): Promise<{
        id: string;
        childId: string;
        score: number;
        zScore: number;
        status: string;
        summary: string;
        weightScore: number;
        heightScore: number;
        nutritionScore: number;
        sanitationScore: number;
        immunizationScore: number;
        recommendations: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
