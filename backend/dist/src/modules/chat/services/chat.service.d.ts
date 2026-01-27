import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';
export declare class ChatService {
    private prisma;
    private readonly apiKey;
    private readonly GEMINI_MODELS;
    constructor(prisma: PrismaService);
    handleMessage(userId: string, dto: SendMessageDto): Promise<{
        sessionId: any;
        modelUsed: string;
        message: any;
    }>;
    private callGeminiWithFallback;
    getSessionHistory(sessionId: string): Promise<any>;
}
