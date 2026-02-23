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
    async getMotherStoredAnalysis(motherId) {
        const analysis = await this.prisma.motherAiAnalysis.findUnique({
            where: { motherId },
        });
        if (!analysis)
            throw new common_1.NotFoundException('Belum ada riwayat analisis untuk Bunda.');
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
    PERAN: Anda adalah Dokter Spesialis Anak dan Ahli Gizi Klinis yang bijaksana, empatik, dan solutif.
    TUGAS: Analisis data medis dan berikan diagnosis yang akurat namun disampaikan dengan bahasa yang tenang, mendidik, dan tidak menakut-nakuti.
    TUJUAN: Memberikan pemahaman kepada orang tua akan kondisi anak mereka, serta memberikan langkah konkret untuk perbaikan tanpa menimbulkan kepanikan berlebihan, terutama jika data masih terbatas.

    DATA PASIEN:
    - Nama: ${child.name} | Umur: ${ageMonths} bulan | JK: ${child.gender}
    - BB: ${latest.weightKg} kg | TB: ${latest.heightCm} cm
    - Lingkar Kepala: ${latest.headCircumferenceCm ? latest.headCircumferenceCm + ' cm' : 'Belum diukur'}
    - Lingkar Lengan (LILA): ${latest.armCircumferenceCm ? latest.armCircumferenceCm + ' cm' : 'Belum diukur'}
    - Z-Score BB/U (Input): ${zScore.toFixed(2)}
    - Data Lahir: BB ${child.birthWeight} kg, PB ${child.birthLength} cm${child.birthHeadCircumference ? ', LK ' + child.birthHeadCircumference + ' cm' : ''}${child.birthArmCircumference ? ', LILA ' + child.birthArmCircumference + ' cm' : ''}

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
                temperature: 0.1,
            });
            return JSON.parse(completion.choices[0].message.content);
        }
        catch (error) {
            this.logger.error(`[AI CRITICAL ERROR] ${error.message}`);
            throw new common_1.ServiceUnavailableException('Gagal melakukan diagnosa AI.');
        }
    }
    calculateZScore(w, g, age) {
        const points = g === 'MALE'
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
    calculateAge(birth) {
        const today = new Date();
        return ((today.getFullYear() - birth.getFullYear()) * 12 +
            today.getMonth() -
            birth.getMonth());
    }
    async runMotherAnalysis(motherId) {
        this.logger.log(`[START] Analisis Kesehatan Ibu: ${motherId}`);
        const mother = await this.prisma.motherProfile.findUnique({
            where: { id: motherId },
            include: {
                environment: true,
                childProfiles: {
                    include: {
                        anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                    },
                },
                user: true,
            },
        });
        if (!mother)
            throw new common_1.NotFoundException('Profil ibu tidak ditemukan.');
        const bmi = mother.weightKg && mother.heightCm
            ? mother.weightKg / Math.pow(mother.heightCm / 100, 2)
            : 0;
        const aiResult = await this.getMotherAiAdvice(mother, bmi);
        try {
            return await this.prisma.motherAiAnalysis.upsert({
                where: { motherId },
                update: {
                    score: aiResult.score,
                    status: aiResult.status,
                    summary: aiResult.summary,
                    bmiScore: aiResult.bmiScore,
                    lilaScore: aiResult.lilaScore,
                    nutritionScore: aiResult.nutritionScore,
                    ttdScore: aiResult.ttdScore,
                    pregnancyScore: aiResult.pregnancyScore,
                    recommendations: aiResult.recommendations,
                },
                create: {
                    motherId,
                    score: aiResult.score,
                    status: aiResult.status,
                    summary: aiResult.summary,
                    bmiScore: aiResult.bmiScore,
                    lilaScore: aiResult.lilaScore,
                    nutritionScore: aiResult.nutritionScore,
                    ttdScore: aiResult.ttdScore,
                    pregnancyScore: aiResult.pregnancyScore,
                    recommendations: aiResult.recommendations,
                },
            });
        }
        catch (e) {
            this.logger.error(`[DB ERROR] ${e.message}`);
            throw new common_1.InternalServerErrorException('Gagal menyimpan hasil analisis ibu.');
        }
    }
    async getMotherAiAdvice(mother, bmi) {
        this.logger.log(`[AI REQUEST] Analisis Kesehatan Ibu via Llama-3...`);
        const childrenInfo = mother.childProfiles
            ?.map((c) => {
            const latest = c.anthropometries?.[0];
            return `- ${c.name} (${c.gender}, BB Lahir: ${c.birthWeight}kg, PB Lahir: ${c.birthLength}cm${latest ? `, BB Terakhir: ${latest.weightKg}kg, TB Terakhir: ${latest.heightCm}cm` : ''})`;
        })
            .join('\n') || 'Belum ada data anak.';
        const envInfo = mother.environment
            ? `Air Bersih: ${mother.environment.cleanWater ? 'Ya' : 'Tidak'}, Sanitasi: ${mother.environment.sanitation}, Jarak Faskes: ${mother.environment.distanceFaskesKm}km, Transportasi: ${mother.environment.transportation}`
            : 'Data lingkungan belum tersedia.';
        const prompt = `
    PERAN: Anda adalah Dokter Spesialis Kandungan dan Ahli Gizi Ibu yang bijaksana, empatik, dan solutif.
    TUGAS: Analisis data kesehatan ibu dan berikan diagnosis serta rekomendasi yang akurat namun disampaikan dengan bahasa yang tenang, mendidik, dan tidak menakut-nakuti.
    TUJUAN: Memberikan pemahaman kepada ibu akan kondisi kesehatannya, serta memberikan langkah konkret untuk perbaikan gizi dan kesehatan.

    DATA IBU:
    - Nama: ${mother.user?.name || 'Bunda'}
    - Usia: ${mother.age} tahun
    - Berat Badan: ${mother.weightKg} kg
    - Tinggi Badan: ${mother.heightCm} cm
    - BMI: ${bmi.toFixed(1)}
    - LILA (Lingkar Lengan Atas): ${mother.lilaCm} cm
    - Status Hamil: ${mother.isPregnant ? `Ya, Trimester ${mother.trimester || 'tidak diketahui'}` : 'Tidak Hamil'}
    - Kepatuhan TTD: ${mother.ttdCompliance || 'Tidak Diketahui'}

    DATA LINGKUNGAN:
    ${envInfo}

    DATA ANAK:
    ${childrenInfo}

    INSTRUKSI PENILAIAN:
    1. ANALISIS GIZI IBU:
       - Evaluasi BMI: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obesitas (>=30)
       - LILA < 23.5 cm menunjukkan risiko KEK (Kurang Energi Kronik)
       - TTD (Tablet Tambah Darah) sangat penting terutama untuk ibu hamil
    
    2. ${mother.isPregnant ? 'ANALISIS KEHAMILAN: Evaluasi status gizi ibu hamil berdasarkan trimester, berat badan ideal, dan risiko komplikasi.' : 'ANALISIS PASCA MELAHIRKAN / TIDAK HAMIL: Evaluasi status gizi ibu dan kesiapan untuk kehamilan berikutnya jika relevan.'}
    
    3. TONE (GAYA BAHASA): Gunakan bahasa yang suportif dan positif. Jika kondisi kurang baik, fokus pada "Potensi Perbaikan".
    
    4. SCORING (0-100):
       - Jika data terbatas, berikan skor moderat (60-75) dengan catatan perlu pemantauan.
       - Skor < 50 hanya untuk kondisi yang membutuhkan perhatian medis segera.
    
    5. SUMMARY: Jelaskan status kesehatan ibu secara keseluruhan dengan objektif namun tenang.
    
    6. REKOMENDASI: Berikan saran praktis:
       - Menu makanan bergizi untuk ibu${mother.isPregnant ? ' hamil (sesuai trimester)' : ''}
       - Pola hidup sehat
       - Pemeriksaan rutin yang direkomendasikan
       - Tips kebersihan dan sanitasi

    OUTPUT JSON MURNI:
    {
      "score": number,
      "status": "string",
      "summary": "string",
      "bmiScore": number,
      "lilaScore": number,
      "nutritionScore": number,
      "ttdScore": number,
      "pregnancyScore": number,
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
            throw new common_1.ServiceUnavailableException('Gagal melakukan analisis AI untuk ibu.');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map