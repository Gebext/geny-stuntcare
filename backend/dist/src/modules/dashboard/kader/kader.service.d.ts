import { PrismaService } from 'src/prisma/prismaservice';
export declare class KaderDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    private getMotherIds;
    getStats(kaderId: string): Promise<{
        totalAnak: any;
        pengukuranBulanIni: string;
        indikasiStunting: any;
    }>;
    getPendingMeasurements(kaderId: string): Promise<any>;
    getRecentActivities(kaderId: string): Promise<any>;
    getRiskDistribution(kaderId: string): Promise<any>;
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
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
