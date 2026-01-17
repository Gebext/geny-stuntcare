import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class NutritionService {
    private prisma;
    constructor(prisma: PrismaService);
    addRecord(userId: string, dto: CreateNutritionDto): Promise<{
        id: string;
        childId: string;
        foodType: string;
        frequencyPerDay: number;
        proteinSource: string;
        recordedAt: Date;
    }>;
    getHistory(childId: string): Promise<{
        id: string;
        childId: string;
        foodType: string;
        frequencyPerDay: number;
        proteinSource: string;
        recordedAt: Date;
    }[]>;
}
