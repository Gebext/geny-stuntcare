import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    addRecord(userId: string, dto: CreateHealthHistoryDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
