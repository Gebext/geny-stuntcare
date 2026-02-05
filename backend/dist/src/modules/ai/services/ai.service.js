"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const groq_sdk_1 = require("groq-sdk");
const prismaservice_1 = require("../../../prisma/prismaservice");
let AiService = AiService_1 = class AiService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AiService_1.name);
    }
    onModuleInit() {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey)
            return;
        this.groq = new groq_sdk_1.default({ apiKey });
    }
    async getStoredAnalysis(childId) {
        const analysis = await this.prisma.aiAnalysis.findUnique({
            where: { childId },
        });
        if (!analysis)
            throw new common_1.NotFoundException('Belum ada riwayat analisis.');
        return analysis;
    }
    async runCalculationAndAi(childId) {
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
        if (!child)
            throw new common_1.NotFoundException('Anak tidak ditemukan');
        const latest = child.anthropometries[0];
        if (!latest)
            throw new common_1.NotFoundException('Data antropometri tidak ada');
        const ageMonths = this.calculateAge(child.birthDate);
        const zScore = this.calculateZScore(latest.weightKg, child.gender, ageMonths);
        const aiResult = await this.getAiMedicalAdvice(child, latest, ageMonths, zScore);
        try {
            return await this.prisma.aiAnalysis.upsert({
                where: { childId },
                update: {
                    score: aiResult.score,
                    zScore: zScore,
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
                    zScore: zScore,
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
        }
        catch (e) {
            this.logger.error(`[DB ERROR] ${e.message}`);
            throw new common_1.InternalServerErrorException('Gagal menyimpan hasil diagnosa.');
        }
    }
    async getAiMedicalAdvice(child, latest, ageMonths, zScore) {
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
                temperature: 0.1,
            });
            return JSON.parse(completion.choices[0].message.content);
        }
        catch (error) {
            this.logger.error(`[AI CRITICAL ERROR] ${error.message}`);
            throw new common_1.ServiceUnavailableException('Gagal melakukan diagnosa AI.');
        }
    }
    calculateZScore(w, g, a) {
        const median = g === 'MALE' ? 9.6 : 8.9;
        return (w - median) / 1.1;
    }
    calculateAge(birth) {
        const today = new Date();
        return ((today.getFullYear() - birth.getFullYear()) * 12 +
            today.getMonth() -
            birth.getMonth());
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map