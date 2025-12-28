import { ChildFilterDto, CreateChildDto } from '../dtos/create-child.dto';
import { ChildService } from '../services/child-service';
export declare class ChildController {
    private readonly childService;
    constructor(childService: ChildService);
    findAll(query: ChildFilterDto): Promise<{
        data: {
            motherName: string;
            mother: {
                user: {
                    name: string;
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
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    create(req: any, dto: CreateChildDto): Promise<{
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
    getMyChildren(req: any): Promise<{
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
    update(req: any, id: string, dto: any): Promise<{
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
    verify(id: string, risk: string): Promise<any>;
    getDetail(id: string): Promise<{
        motherName: string;
        contactMother: string;
        summary: {
            totalMeasurements: number;
            totalVaccines: number;
            lastDiagnosis: string;
            isVerified: boolean;
        };
        mother: {
            user: {
                name: string;
                phone: string;
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
        aiResults: ({
            recommendations: {
                id: string;
                aiResultId: string;
                category: string;
                content: string;
                frequency: string;
                isCompleted: boolean;
            }[];
        } & {
            id: string;
            childId: string;
            riskLevel: string;
            dominantFactors: import(".prisma/client").Prisma.JsonValue;
            modelVersion: string;
            generatedAt: Date;
        })[];
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
