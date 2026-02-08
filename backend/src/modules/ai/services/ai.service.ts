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
    PERAN: Anda adalah Dokter Spesialis Anak dan Ahli Gizi Klinis yang bijaksana, empatik, dan solutif.
    TUGAS: Analisis data medis dan berikan diagnosis yang akurat namun disampaikan dengan bahasa yang tenang, mendidik, dan tidak menakut-nakuti.
    TUJUAN: Memberikan pemahaman kepada orang tua akan kondisi anak mereka, serta memberikan langkah konkret untuk perbaikan tanpa menimbulkan kepanikan berlebihan, terutama jika data masih terbatas.

    DATA PASIEN:
    - Nama: ${child.name} | Umur: ${ageMonths} bulan | JK: ${child.gender}
    - BB: ${latest.weightKg} kg | TB: ${latest.heightCm} cm
    - Z-Score BB/U (Input): ${zScore.toFixed(2)}

    INSTRUKSI PENILAIAN:
    1. STATUS GIZI: Gunakan standar WHO (Gizi Buruk/Kurang/Baik/Obesitas).
    2. TONE (GAYA BAHASA): Gunakan bahasa yang suportif dan positif. Hindari kata-kata yang terlalu memvonis kasar. Jika kondisi kurang baik, fokus pada "Potensi Perbaikan".
    3. SCORING (0-100): 
       - Jika data terbatas (misal hanya satu pengukuran), jangan berikan skor terlalu rendah (misal < 50) kecuali ada indikasi bahaya akut. Berikan skor moderat (misal 60-75) dengan catatan perlukan pemantauan lebih lanjut.
       - Jika status "Gizi Kurang" atau "Gizi Buruk", berikan skor yang proporsional (misal 50-70) agar orang tua waspada namun tidak putus asa. Skor < 50 hanya untuk kondisi kritis/gawat darurat.
    4. SUMMARY: Jelaskan status saat ini dengan objektif namun tenang. Berikan konteks bahwa pengukuran rutin sangat diperlukan untuk diagnosis pasti. Jangan langsung memprediksi hal buruk permanen (stunting/kognitif) jika data hanya satu titik, gunakan kata "berisiko" alih-alih "akan mengalami".
    5. REKOMENDASI: Berikan saran praktis sehari-hari (menu makanan murah bergizi, pola asuh, kebersihan). 

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

  private calculateZScore(w: number, g: string, age: number) {
    // Data WHO Weight-for-Age (WFA) Simplified [Age(Mo), Median(Kg), SD]
    // Sumber: WHO Child Growth Standards
    const points =
      g === 'MALE'
        ? [
            [0, 3.3, 0.4],
            [3, 6.4, 0.7],
            [6, 7.9, 0.8],
            [9, 8.9, 0.9],
            [12, 9.6, 1.0],
            [18, 10.9, 1.2],
            [24, 12.2, 1.3],
            [36, 14.3, 1.6],
            [48, 16.3, 1.9],
            [60, 18.3, 2.2],
          ]
        : [
            [0, 3.2, 0.4],
            [3, 5.8, 0.7],
            [6, 7.3, 0.8],
            [9, 8.2, 0.9],
            [12, 8.9, 1.0],
            [18, 10.2, 1.2],
            [24, 11.5, 1.3],
            [36, 13.9, 1.6],
            [48, 16.1, 1.9],
            [60, 18.2, 2.2],
          ];

    // Temukan rentang usia untuk interpolasi
    let lower = points[0];
    let upper = points[points.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
      if (age >= points[i][0] && age <= points[i + 1][0]) {
        lower = points[i];
        upper = points[i + 1];
        break;
      }
    }

    const [a1, m1, sd1] = lower;
    const [a2, m2, sd2] = upper;

    let median = m1;
    let sd = sd1;

    if (a2 !== a1) {
      const factor = (age - a1) / (a2 - a1);
      median = m1 + factor * (m2 - m1);
      sd = sd1 + factor * (sd2 - sd1);
    }

    return (w - median) / sd;
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
