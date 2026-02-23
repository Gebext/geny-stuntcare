import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { UpdateNutritionDto } from '../dtos/update-nutrition.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class NutritionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateRecord(userId: string, recordId: string, dto: UpdateNutritionDto): Promise<{
        id: string;
        childId: string;
        foodType: string;
        frequencyPerDay: number;
        proteinSource: string;
        recordedAt: Date;
    }>;
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
