import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';
export declare class ChatService {
    private prisma;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(prisma: PrismaService);
    handleMessage(userId: string, dto: SendMessageDto): Promise<{
        sessionId: any;
        message: {
            id: string;
            sessionId: string;
            sender: string;
            message: string;
            createdAt: Date;
        };
    }>;
    getSessionHistory(sessionId: string): Promise<{
        id: string;
        sessionId: string;
        sender: string;
        message: string;
        createdAt: Date;
    }[]>;
}
