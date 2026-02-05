import { PrismaService } from 'src/prisma/prismaservice';
export declare class KaderDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    private getMotherIds;
    getStats(kaderId: string): Promise<{
        totalAnak: number;
        pengukuranBulanIni: string;
        indikasiStunting: number;
    }>;
    getPendingMeasurements(kaderId: string): Promise<({
        mother: {
            user: {
                name: string;
                phone: string;
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
        };
    } & {
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
    })[]>;
    getRecentActivities(kaderId: string): Promise<({
        child: {
            name: string;
        };
    } & {
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    })[]>;
    getRiskDistribution(kaderId: string): Promise<{
        label: string;
        value: number;
    }[]>;
    getPriorityAgenda(kaderId: string, page?: number, limit?: number): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPendingList(kaderId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            motherName: string;
            motherPhone: string;
            status: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
