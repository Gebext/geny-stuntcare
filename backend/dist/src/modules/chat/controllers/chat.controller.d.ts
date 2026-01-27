import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../dtos/send.message';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, dto: SendMessageDto): Promise<{
        sessionId: any;
        modelUsed: string;
        message: any;
    }>;
    getHistory(sessionId: string): Promise<any>;
}
