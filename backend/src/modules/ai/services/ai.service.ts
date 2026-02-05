import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return;
    this.groq = new Groq({ apiKey });
  }

  async getStoredAnalysis(childId: string) {
    const analysis = await this.prisma.aiAnalysis.findUnique({
      where: { childId },
    });
    if (!analysis) throw new NotFoundException('Belum ada riwayat analisis.');
    return analysis;
  }

  async runCalculationAndAi(childId: string) {
    this.logger.log(`[START] Diagnosis Tegas untuk Child ID: ${childId}`);

    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 5 },
        immunizations: true,
        mother: { include: { environment: true } },
      },
    });

    if (!child) throw new NotFoundException('Anak tidak ditemukan');
    const latest = child.anthropometries[0];
    if (!latest) throw new NotFoundException('Data antropometri tidak ada');

    const ageMonths = this.calculateAge(child.birthDate);
    // Hitung Z-Score (BB/U) secara manual sebagai referensi AI
    const zScore = this.calculateZScore(
      latest.weightKg,
      child.gender,
      ageMonths,
    );

    // Ambil hasil diagnosa dari AI
    const aiResult = await this.getAiMedicalAdvice(
      child,
      latest,
      ageMonths,
      zScore,
    );

    try {
      return await this.prisma.aiAnalysis.upsert({
        where: { childId },
        update: {
          score: aiResult.score,
          zScore: zScore, // SIMPAN KE DB
          status: aiResult.status,
          summary: aiResult.summary,
          weightScore: aiResult.weightScore,
          heightScore: aiResult.heightScore,
          nutritionScore: aiResult.nutritionScore,
          sanitationScore: aiResult.sanitationScore,
          immunizationScore: aiResult.immunizationScore,
          recommendations: aiResult.recommendations,
        },
        create: {
          childId,
          score: aiResult.score,
          zScore: zScore, // SIMPAN KE DB
          status: aiResult.status,
          summary: aiResult.summary,
          weightScore: aiResult.weightScore,
          heightScore: aiResult.heightScore,
          nutritionScore: aiResult.nutritionScore,
          sanitationScore: aiResult.sanitationScore,
          immunizationScore: aiResult.immunizationScore,
          recommendations: aiResult.recommendations,
        },
      });
    } catch (e) {
      this.logger.error(`[DB ERROR] ${e.message}`);
      throw new InternalServerErrorException('Gagal menyimpan hasil diagnosa.');
    }
  }

  private async getAiMedicalAdvice(
    child: any,
    latest: any,
    ageMonths: number,
    zScore: number,
  ) {
    this.logger.log(`[AI REQUEST] Menjalankan Llama-3 (Medical Mode)...`);

    const prompt = `
    PERAN: Anda adalah Dokter Spesialis Anak dan Ahli Gizi Klinis.
    TUGAS: Analisis data medis dan berikan diagnosis yang JUJUR, TEGAS, dan AKURAT. 
    DILARANG menggunakan bahasa halus (eufemisme). Jika kondisi buruk, katakan buruk.

    DATA PASIEN:
    - Nama: ${child.name} | Umur: ${ageMonths} bulan | JK: ${child.gender}
    - BB: ${latest.weightKg} kg | TB: ${latest.heightCm} cm
    - Z-Score BB/U (Input): ${zScore.toFixed(2)}

    INSTRUKSI PENILAIAN:
    1. STATUS GIZI: Gunakan standar WHO. Jika Z-Score < -3 sebut "Gizi Buruk", -3 s/d -2 sebut "Gizi Kurang", > 2 sebut "Obesitas".
    2. SCORING: Berikan skor keseluruhan (0-100). Jika status Gizi Buruk/Kurang, skor HARUS di bawah 45.
    3. SUMMARY: Kalimat pertama harus diagnosis medis. Kalimat kedua harus konsekuensi klinis jika tidak ditangani segera (misal: risiko stunting permanen atau penurunan kognitif).
    4. BREAKDOWN SKOR (0-100): Berikan skor weight, height, nutrition, sanitation, dan immunization secara objektif.

    OUTPUT JSON MURNI:
    {
      "score": number,
      "status": "string",
      "summary": "string",
      "weightScore": number,
      "heightScore": number,
      "nutritionScore": number,
      "sanitationScore": number,
      "immunizationScore": number,
      "recommendations": [
        { "title": "string", "desc": "string", "type": "SUCCESS" | "WARNING" | "INFO" }
      ]
    }
    `;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.1, // Sangat rendah agar AI tidak "kreatif" dan tetap pada fakta medis
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      this.logger.error(`[AI CRITICAL ERROR] ${error.message}`);
      throw new ServiceUnavailableException('Gagal melakukan diagnosa AI.');
    }
  }

  private calculateZScore(w: number, g: string, a: number) {
    // Referensi kasar Median WHO BB/U untuk 0-24 bulan
    const median = g === 'MALE' ? 9.6 : 8.9;
    return (w - median) / 1.1;
  }

  private calculateAge(birth: Date) {
    const today = new Date();
    return (
      (today.getFullYear() - birth.getFullYear()) * 12 +
      today.getMonth() -
      birth.getMonth()
    );
  }
}
