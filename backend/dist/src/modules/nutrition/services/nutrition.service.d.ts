import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class NutritionService {
    private prisma;
    constructor(prisma: PrismaService);
    addRecord(userId: string, dto: CreateNutritionDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
