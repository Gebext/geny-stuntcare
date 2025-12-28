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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
const node_fetch_1 = require("node-fetch");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.apiKey = 'AIzaSyBcbh0OXjNi0yVFwM4imn85sOjzXStYUG4';
        this.GEMINI_MODELS = [
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite',
            'gemini-3-flash',
        ];
    }
    async handleMessage(userId, dto) {
        const children = await this.prisma.childProfile.findMany({
            where: { mother: { userId } },
            include: {
                anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 2 },
                healthHistories: { orderBy: { diagnosisDate: 'desc' }, take: 1 },
            },
        });
        let session;
        if (dto.sessionId) {
            session = await this.prisma.chatSession.findUnique({
                where: { id: dto.sessionId },
            });
            if (!session) {
                throw new common_1.NotFoundException('Sesi chat tidak ditemukan');
            }
        }
        else {
            session = await this.prisma.chatSession.create({
                data: {
                    userId,
                    contextSnapshot: children.length ? children : { info: 'No data' },
                },
            });
        }
        await this.prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'USER',
                message: dto.message,
            },
        });
        const childrenContext = children
            .map((c, i) => {
            const fisik = c.anthropometries[0]
                ? `BB ${c.anthropometries[0].weightKg}kg, TB ${c.anthropometries[0].heightCm}cm`
                : 'Belum ada data fisik';
            const kesehatan = c.healthHistories[0]
                ? c.healthHistories[0].diseaseName
                : 'Tidak ada riwayat penyakit';
            return `ANAK ${i + 1}
Nama: ${c.name}
JK: ${c.gender}
TTL: ${c.birthDate}
Fisik: ${fisik}
Kesehatan: ${kesehatan}`;
        })
            .join('\n\n');
        const systemPrompt = `
Anda adalah GENY, asisten ahli kesehatan anak & pencegahan stunting.
User dipanggil "Mama Cantik".

DATA ANAK:
${childrenContext}

ATURAN WAJIB:
- Jawaban ramah & empatik
- Gunakan bullet point
- Jika ada indikasi stunting → peringatan lembut
- Jangan menakut-nakuti
`;
        const finalPrompt = `
${systemPrompt}

PERTANYAAN MAMA CANTIK:
${dto.message}
`;
        const ai = await this.callGeminiWithFallback(finalPrompt);
        const saved = await this.prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'GENY_AI',
                message: ai.text,
            },
        });
        return {
            sessionId: session.id,
            modelUsed: ai.model,
            message: saved,
        };
    }
    async callGeminiWithFallback(prompt) {
        let lastError;
        for (const model of this.GEMINI_MODELS) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
                const res = await (0, node_fetch_1.default)(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                });
                const data = await res.json();
                if (!res.ok) {
                    const status = data?.error?.status;
                    const message = data?.error?.message;
                    if (res.status === 429 || status === 'RESOURCE_EXHAUSTED') {
                        console.warn(`[Geny] Model ${model} limit tercapai, pindah model...`);
                        lastError = message;
                        continue;
                    }
                    throw new Error(message || 'Gemini error');
                }
                return {
                    model,
                    text: data.candidates[0].content.parts[0].text,
                };
            }
            catch (err) {
                lastError = err.message;
            }
        }
        throw new Error('Geny sedang istirahat 😴. Semua model sedang kelelahan.');
    }
    async getSessionHistory(sessionId) {
        return this.prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map