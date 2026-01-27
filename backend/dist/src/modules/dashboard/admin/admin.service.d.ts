import { PrismaService } from 'src/prisma/prismaservice';
export declare class AdminDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMainStats(): Promise<{
        overview: {
            totalUsers: any;
            totalAnak: any;
            totalIbu: any;
            totalKader: any;
        };
        stuntingDistribution: any;
        recentRegistrations: any;
    }>;
    getKaderPerformance(): Promise<any>;
    getAllChildren(query: {
        page?: any;
        limit?: any;
        search?: string;
        riskStatus?: string;
        gender?: string;
        isVerified?: string;
    }): Promise<{
        list: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getChildById(id: string): Promise<any>;
}
