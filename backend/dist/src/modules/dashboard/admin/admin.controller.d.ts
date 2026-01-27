import { AdminDashboardService } from './admin.service';
export declare class AdminDashboardController {
    private readonly adminService;
    constructor(adminService: AdminDashboardService);
    getAllChildren(page?: number, limit?: number, search?: string, riskStatus?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getChildDetail(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getSummary(): Promise<{
        success: boolean;
        message: string;
        data: {
            kaderPerformance: any;
            overview: {
                totalUsers: any;
                totalAnak: any;
                totalIbu: any;
                totalKader: any;
            };
            stuntingDistribution: any;
            recentRegistrations: any;
        };
    }>;
}
