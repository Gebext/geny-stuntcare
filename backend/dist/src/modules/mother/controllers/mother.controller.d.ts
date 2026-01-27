import { MotherService } from '../services/mother.service';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';
export declare class MotherController {
    private readonly motherService;
    constructor(motherService: MotherService);
    handleProfile(req: any, dto: CreateMotherProfileDto): Promise<any>;
    updateProfile(req: any, dto: CreateMotherProfileDto): Promise<any>;
    getMyProfile(req: any): Promise<any>;
    getMotherProfile(userId: string): Promise<any>;
    getAllMothers(page?: string, limit?: string, search?: string, status?: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPage: number;
        };
    }>;
    assignKader(data: {
        kaderId: string;
        motherId: string;
    }): Promise<any>;
    unassignKader(data: {
        motherId: string;
    }): Promise<any>;
    getAssignedMothers(req: any): Promise<any>;
    getAssignedChildren(req: any, name?: string, gender?: string, stuntingRisk?: string, page?: string): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
}
