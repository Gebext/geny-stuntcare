import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../dtos/send.message';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, dto: SendMessageDto): Promise<{
        sessionId: any;
        message: {
            id: string;
            sessionId: string;
            sender: string;
            message: string;
            createdAt: Date;
        };
    }>;
    getHistory(sessionId: string): Promise<{
        id: string;
        sessionId: string;
        sender: string;
        message: string;
        createdAt: Date;
    }[]>;
}
