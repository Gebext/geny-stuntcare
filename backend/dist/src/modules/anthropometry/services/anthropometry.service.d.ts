import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class AnthropometryService {
    private prisma;
    constructor(prisma: PrismaService);
    recordMeasurement(userId: string, userName: string, roles: number[], dto: CreateAnthropometryDto): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }>;
    getHistoryByChild(childId: string): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }[]>;
}
