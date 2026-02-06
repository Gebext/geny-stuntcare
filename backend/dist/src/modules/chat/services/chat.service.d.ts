import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { SendMessageDto } from '../dtos/send.message';
export declare class ChatService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private groq;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
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
    private calculateAge;
    getSessionHistory(sessionId: string): Promise<{
        id: string;
        sessionId: string;
        sender: string;
        message: string;
        createdAt: Date;
    }[]>;
}
