import { PrismaService } from 'src/prisma/prismaservice';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';
export declare class MotherService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertProfile(userId: string, dto: CreateMotherProfileDto): Promise<{
        id: string;
        userId: string;
        age: number;
        heightCm: number;
        weightKg: number;
        lilaCm: number;
        isPregnant: boolean;
        trimester: number;
        ttdCompliance: string;
        createdAt: Date;
    }>;
    getProfile(userId: string): Promise<{
        childProfiles: {
            id: string;
            motherId: string;
            name: string;
            gender: string;
            birthDate: Date;
            birthWeight: number;
            birthLength: number;
            asiExclusive: boolean;
            isVerified: boolean;
            stuntingRisk: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        environment: {
            id: string;
            motherId: string;
            cleanWater: boolean;
            sanitation: string;
            distanceFaskesKm: number;
            transportation: string;
        };
    } & {
        id: string;
        userId: string;
        age: number;
        heightCm: number;
        weightKg: number;
        lilaCm: number;
        isPregnant: boolean;
        trimester: number;
        ttdCompliance: string;
        createdAt: Date;
    }>;
}
