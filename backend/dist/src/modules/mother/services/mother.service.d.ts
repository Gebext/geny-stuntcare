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
    getAssignedMothers(kaderId: string): Promise<any>;
    getAssignedChildren(kaderId: string, query: {
        name?: string;
        gender?: string;
        stuntingRisk?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
    assignMotherToKader(kaderId: string, motherId: string): Promise<any>;
    getAllMothers(query: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
    }): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPage: number;
        };
    }>;
    unassignMotherFromKader(motherId: string): Promise<any>;
}
