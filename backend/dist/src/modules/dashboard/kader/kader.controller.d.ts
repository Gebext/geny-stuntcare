import { KaderDashboardService } from './kader.service';
export declare class KaderDashboardController {
    private readonly kaderService;
    constructor(kaderService: KaderDashboardService);
    getFullDashboard(req: any): Promise<{
        stats: {
            totalAnak: number;
            pengukuranBulanIni: string;
            indikasiStunting: number;
        };
        pendingMeasurements: ({
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
        })[];
        recentActivities: ({
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
        })[];
        riskDistribution: {
            label: string;
            value: number;
        }[];
    }>;
    getPending(req: any, page: string, limit: string): Promise<{
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
