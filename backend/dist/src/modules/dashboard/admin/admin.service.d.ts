import { PrismaService } from 'src/prisma/prismaservice';
export declare class AdminDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMainStats(): Promise<{
        overview: {
            totalUsers: number;
            totalAnak: number;
            totalIbu: number;
            totalKader: number;
        };
        stuntingDistribution: {
            status: string;
            count: number;
        }[];
        recentRegistrations: {
            name: string;
            email: string;
            createdAt: Date;
        }[];
    }>;
    getKaderPerformance(): Promise<{
        namaKader: string;
        jumlahIbuDibina: number;
    }[]>;
    getAllChildren(query: {
        page?: any;
        limit?: any;
        search?: string;
        riskStatus?: string;
        gender?: string;
        isVerified?: string;
    }): Promise<{
        list: ({
            aiAnalysis: {
                id: string;
                childId: string;
                score: number;
                status: string;
                summary: string;
                weightScore: number;
                heightScore: number;
                nutritionScore: number;
                sanitationScore: number;
                immunizationScore: number;
                recommendations: import(".prisma/client").Prisma.JsonValue;
                createdAt: Date;
                updatedAt: Date;
            };
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
            anthropometries: {
                id: string;
                childId: string;
                weightKg: number;
                heightCm: number;
                ageMonth: number;
                measuredBy: string;
                measurementDate: Date;
                verified: boolean;
                createdAt: Date;
            }[];
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getChildById(id: string): Promise<{
        aiAnalysis: {
            id: string;
            childId: string;
            score: number;
            status: string;
            summary: string;
            weightScore: number;
            heightScore: number;
            nutritionScore: number;
            sanitationScore: number;
            immunizationScore: number;
            recommendations: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
            updatedAt: Date;
        };
        mother: {
            user: {
                id: string;
                name: string;
                email: string;
                passwordHash: string;
                phone: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
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
        };
        anthropometries: {
            id: string;
            childId: string;
            weightKg: number;
            heightCm: number;
            ageMonth: number;
            measuredBy: string;
            measurementDate: Date;
            verified: boolean;
            createdAt: Date;
        }[];
        immunizations: {
            id: string;
            childId: string;
            vaccineName: string;
            status: string;
            dateGiven: Date;
        }[];
        nutritionHistories: {
            id: string;
            childId: string;
            foodType: string;
            frequencyPerDay: number;
            proteinSource: string;
            recordedAt: Date;
        }[];
        healthHistories: {
            id: string;
            childId: string;
            diseaseName: string;
            diagnosisDate: Date;
            isChronic: boolean;
        }[];
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
    }>;
}
