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
const fetch = require('node-fetch');
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.apiKey = 'AIzaSyBcbh0OXjNi0yVFwM4imn85sOjzXStYUG4';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${this.apiKey}`;
    }
    async handleMessage(userId, dto) {
        const children = await this.prisma.childProfile.findMany({
            where: { mother: { userId } },
            include: {
                anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                nutritionHistories: { orderBy: { recordedAt: 'desc' }, take: 3 },
            },
        });
        let session;
        if (dto.sessionId) {
            session = await this.prisma.chatSession.findUnique({
                where: { id: dto.sessionId },
            });
            if (!session)
                throw new common_1.NotFoundException('Sesi chat tidak ditemukan');
        }
        else {
            session = await this.prisma.chatSession.create({
                data: {
                    userId: userId,
                    contextSnapshot: children.length > 0 ? children : { info: 'No data' },
                },
            });
        }
        await this.prisma.chatMessage.create({
            data: { sessionId: session.id, sender: 'USER', message: dto.message },
        });
        const childrenInfo = children
            .map((c) => `Nama: ${c.name}, Lahir: ${c.birthDate}, Data Fisik: ${JSON.stringify(c.anthropometries[0] || 'N/A')}`)
            .join(' | ');
        const systemPrompt = `Anda adalah Geny, asisten pencegahan stunting. 
    User memiliki ${children.length} anak yaitu: [${childrenInfo}]. 
    Gunakan data ini untuk menjawab secara spesifik. Panggil user 'Mama Cantik'.`;
        try {
            console.log('--- Menghubungi Gemini 3 Flash ---');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: `${systemPrompt}\n\nUser: ${dto.message}` }],
                        },
                    ],
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error?.message || 'Gagal akses Gemini');
            }
            const aiResponse = data.candidates[0].content.parts[0].text;
            const savedAiMsg = await this.prisma.chatMessage.create({
                data: {
                    sessionId: session.id,
                    sender: 'GENY_AI',
                    message: aiResponse,
                },
            });
            return { sessionId: session.id, message: savedAiMsg };
        }
        catch (error) {
            console.error('Chat Error:', error.message);
            throw new Error(`Geny sedang sibuk: ${error.message}`);
        }
    }
    async getSessionHistory(sessionId) {
        return this.prisma.chatMessage.findMany({
            where: { sessionId: sessionId },
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