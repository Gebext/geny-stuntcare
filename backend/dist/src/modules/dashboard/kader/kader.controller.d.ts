import { KaderDashboardService } from './kader.service';
export declare class KaderDashboardController {
    private readonly kaderService;
    constructor(kaderService: KaderDashboardService);
    getFullDashboard(req: any): Promise<{
        stats: {
            totalAnak: any;
            pengukuranBulanIni: string;
            indikasiStunting: any;
        };
        pendingMeasurements: any;
        recentActivities: any;
        riskDistribution: any;
    }>;
    getPending(req: any, page: string, limit: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
        success: boolean;
    }>;
    getAgenda(req: any, page: string, limit: string): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        success: boolean;
        message: string;
    }>;
}
