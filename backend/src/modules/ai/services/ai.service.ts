import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from 'src/prisma/prismaservice';
import { AiAnalysisResponseDto } from '../dtos/ai-analysis.dto';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getStoredAnalysis(
    childId: string,
  ): Promise<AiAnalysisResponseDto | null> {
    const analysis = await this.prisma.aiAnalysis.findUnique({
      where: { childId },
    });
    if (!analysis) return null;
    return analysis as unknown as AiAnalysisResponseDto;
  }

  async runCalculationAndAi(childId: string): Promise<AiAnalysisResponseDto> {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 5 },
        immunizations: true,
        mother: { include: { environment: true } },
      },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // Logic Skor Manual (Bisa kamu perhalus rumusnya nanti)
    const weightScore = child.anthropometries[0] ? 85 : 50;
    const heightScore = child.anthropometries[0] ? 82 : 50;
    const nutritionScore = child.nutritionHistories.length >= 3 ? 90 : 60;
    const immScore = child.immunizations.length >= 4 ? 100 : 70;
    const saniScore = child.mother?.environment?.cleanWater ? 95 : 60;

    const totalScore = Math.round(
      (weightScore + heightScore + nutritionScore + immScore + saniScore) / 5,
    );

    // AI Advice via Gemini
    const aiResult = await this.getAiAdvice(child, totalScore);

    const result = await this.prisma.aiAnalysis.upsert({
      where: { childId },
      update: {
        score: totalScore,
        status: totalScore > 80 ? 'Risiko Rendah' : 'Perlu Pantauan',
        summary: aiResult.summary,
        weightScore,
        heightScore,
        nutritionScore,
        sanitationScore: saniScore,
        immunizationScore: immScore,
        recommendations: aiResult.recs,
      },
      create: {
        childId,
        score: totalScore,
        status: totalScore > 80 ? 'Risiko Rendah' : 'Perlu Pantauan',
        summary: aiResult.summary,
        weightScore,
        heightScore,
        nutritionScore,
        sanitationScore: saniScore,
        immunizationScore: immScore,
        recommendations: aiResult.recs,
      },
    });

    return result as unknown as AiAnalysisResponseDto;
  }

  private async getAiAdvice(child: any, score: number) {
    const prompt = `Analisis kesehatan balita ${child.name} (Skor: ${score}). 
    Berikan JSON murni: { "summary": "1 kalimat", "recs": [{"title": "...", "desc": "...", "type": "WARNING/INFO/SUCCESS"}] }. 
    Wajib 3 rekomendasi. Gunakan Bahasa Indonesia.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '');
      return JSON.parse(text);
    } catch (e) {
      return {
        summary: 'Analisis rutin kesehatan anak.',
        recs: [
          {
            title: 'Nutrisi',
            desc: 'Berikan protein hewani setiap hari.',
            type: 'INFO',
          },
          {
            title: 'Pantau TB/BB',
            desc: 'Rutin ke Posyandu sebulan sekali.',
            type: 'SUCCESS',
          },
          {
            title: 'Sanitasi',
            desc: 'Pastikan kebersihan alat makan.',
            type: 'WARNING',
          },
        ],
      };
    }
  }
}
