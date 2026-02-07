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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
const groq_sdk_1 = require("groq-sdk");
let ChatService = ChatService_1 = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    onModuleInit() {
        const apiKey = process.env.GROQ_API_KEY;
        if (apiKey)
            this.groq = new groq_sdk_1.default({ apiKey });
    }
    async handleMessage(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                motherProfile: {
                    include: {
                        environment: true,
                        childProfiles: {
                            include: {
                                anthropometries: {
                                    orderBy: { measurementDate: 'desc' },
                                    take: 5,
                                },
                                nutritionHistories: {
                                    orderBy: { recordedAt: 'desc' },
                                    take: 3,
                                },
                                aiAnalysis: true,
                                healthHistories: {
                                    orderBy: { diagnosisDate: 'desc' },
                                    take: 2,
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user?.motherProfile)
            throw new common_1.NotFoundException('Profil belum lengkap');
        const familyContext = {
            mama: {
                nama: user.name,
                isHamil: user.motherProfile.isPregnant,
                trimester: user.motherProfile.trimester,
                sanitasi: user.motherProfile.environment?.sanitation || 'Belum diisi',
                airBersih: user.motherProfile.environment?.cleanWater
                    ? 'Ada'
                    : 'Tidak Ada',
            },
            anakAnak: user.motherProfile.childProfiles.map((c) => ({
                nama: c.name,
                usia: this.calculateAge(c.birthDate) + ' bulan',
                gender: c.gender,
                hasilAI: c.aiAnalysis
                    ? {
                        status: c.aiAnalysis.status,
                        skorGizi: c.aiAnalysis.score,
                        zScore: c.aiAnalysis.zScore,
                        rekomendasi: c.aiAnalysis.recommendations,
                    }
                    : 'Belum ada analisis mendalam',
                riwayatFisik: c.anthropometries.map((a) => ({
                    bb: a.weightKg,
                    tb: a.heightCm,
                    tgl: a.measurementDate,
                })),
                makanTerakhir: c.nutritionHistories[0]?.foodType || 'Belum tercatat',
            })),
        };
        let session;
        if (dto.sessionId) {
            session = await this.prisma.chatSession.findUnique({
                where: { id: dto.sessionId },
            });
        }
        if (!session) {
            session = await this.prisma.chatSession.create({
                data: { userId, contextSnapshot: familyContext },
            });
        }
        const systemPrompt = `
      Anda adalah GENY, AI Dokter Spesialis Anak & Nutrisi. 
      Tugas: Bantu Mama ${user.name} memantau tumbuh kembang anaknya.
      
      KONTEKS DATA KELUARGA:
      ${JSON.stringify(familyContext, null, 2)}

      ATURAN:
      - Gunakan data 'hasilAI' (zScore & skorGizi) untuk memberikan diagnosa.
      - Jika Mama tanya soal gizi, hubungkan dengan riwayat makan dan sanitasi rumahnya.
      - Panggil "Mama ${user.name}". Bahasa harus empati, detail, dan profesional.
      - Gunakan Bullet Points.
    `;
        if (!this.groq) {
            this.logger.error('GROQ_API_KEY is not configured');
            throw new common_1.NotFoundException('Layanan AI belum dikonfigurasi. Hubungi administrator.');
        }
        const completion = await this.groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: dto.message },
            ],
            temperature: 0.5,
        });
        const aiMsg = completion.choices[0].message.content;
        await this.prisma.chatMessage.create({
            data: { sessionId: session.id, sender: 'USER', message: dto.message },
        });
        const savedAi = await this.prisma.chatMessage.create({
            data: { sessionId: session.id, sender: 'GENY_AI', message: aiMsg },
        });
        return { sessionId: session.id, message: savedAi };
    }
    calculateAge(birth) {
        const diff = Date.now() - birth.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    }
    async getSessionHistory(sessionId) {
        return await this.prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map