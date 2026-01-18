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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const prismaservice_1 = require("../../../prisma/prismaservice");
let AiService = class AiService {
    constructor(prisma) {
        this.prisma = prisma;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    async getStoredAnalysis(childId) {
        const analysis = await this.prisma.aiAnalysis.findUnique({
            where: { childId },
        });
        if (!analysis)
            return null;
        return analysis;
    }
    async runCalculationAndAi(childId) {
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
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        const weightScore = child.anthropometries[0] ? 85 : 50;
        const heightScore = child.anthropometries[0] ? 82 : 50;
        const nutritionScore = child.nutritionHistories.length >= 3 ? 90 : 60;
        const immScore = child.immunizations.length >= 4 ? 100 : 70;
        const saniScore = child.mother?.environment?.cleanWater ? 95 : 60;
        const totalScore = Math.round((weightScore + heightScore + nutritionScore + immScore + saniScore) / 5);
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
        return result;
    }
    async getAiAdvice(child, score) {
        const prompt = `Analisis kesehatan balita ${child.name} (Skor: ${score}). 
    Berikan JSON murni: { "summary": "1 kalimat", "recs": [{"title": "...", "desc": "...", "type": "WARNING/INFO/SUCCESS"}] }. 
    Wajib 3 rekomendasi. Gunakan Bahasa Indonesia.`;
        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '');
            return JSON.parse(text);
        }
        catch (e) {
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map