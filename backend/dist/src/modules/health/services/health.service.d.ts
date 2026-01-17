import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    addRecord(userId: string, dto: CreateHealthHistoryDto): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }>;
    getHistory(childId: string): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }[]>;
}
