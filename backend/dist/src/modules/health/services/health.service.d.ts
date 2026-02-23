import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { UpdateHealthHistoryDto } from '../dtos/update-health-history.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class HealthService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateRecord(userId: string, recordId: string, dto: UpdateHealthHistoryDto): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }>;
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
