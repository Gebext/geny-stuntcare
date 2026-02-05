export interface AiRecommendation {
    title: string;
    desc: string;
    type: 'WARNING' | 'INFO' | 'SUCCESS';
}
export declare class AiAnalysisResponseDto {
    id: string;
    childId: string;
    score: number;
    status: string;
    summary: string;
    weightScore: number;
    heightScore: number;
    nutritionScore: number;
    sanitationScore: number;
    immunizationScore: number;
    recommendations: AiRecommendation[];
    updatedAt: Date;
}
