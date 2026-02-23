import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { UpdateAnthropometryDto } from '../dtos/update-anthropometry.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class AnthropometryService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateRecord(userId: string, roles: number[], recordId: string, dto: UpdateAnthropometryDto): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        headCircumferenceCm: number;
        armCircumferenceCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }>;
    recordMeasurement(userId: string, userName: string, roles: number[], dto: CreateAnthropometryDto): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        headCircumferenceCm: number;
        armCircumferenceCm: number;
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
        headCircumferenceCm: number;
        armCircumferenceCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }[]>;
}
