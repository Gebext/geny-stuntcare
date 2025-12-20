import { CreateChildDto } from '../dtos/create-child.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class ChildService {
    private prisma;
    constructor(prisma: PrismaService);
    createChild(userId: string, dto: CreateChildDto): Promise<{
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
    }>;
    updateChild(userId: string, childId: string, dto: any): Promise<{
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
    }>;
    verifyByKader(childId: string, risk: string): Promise<any>;
    getMyChildren(userId: string): Promise<{
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
    }[]>;
}
