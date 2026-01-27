import { PrismaService } from 'src/prisma/prismaservice';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';
export declare class MotherService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertProfile(userId: string, dto: CreateMotherProfileDto): Promise<any>;
    getProfile(userId: string): Promise<any>;
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
