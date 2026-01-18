// src/ai/dto/ai-analysis.dto.ts

export interface AiRecommendation {
  title: string;
  desc: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
}

export class AiAnalysisResponseDto {
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
  recommendations: AiRecommendation[]; // Gunakan interface ini
  updatedAt: Date;
}
