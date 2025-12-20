import { MotherService } from '../services/mother.service';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';
export declare class MotherController {
    private readonly motherService;
    constructor(motherService: MotherService);
    handleProfile(req: any, dto: CreateMotherProfileDto): Promise<{
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
    }>;
    updateProfile(req: any, dto: CreateMotherProfileDto): Promise<{
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
    }>;
    getMyProfile(req: any): Promise<{
        childProfiles: {
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
    }>;
    getMotherProfile(userId: string): Promise<{
        childProfiles: {
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
    }>;
}
