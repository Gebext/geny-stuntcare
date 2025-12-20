import { CreateChildDto } from '../dtos/create-child.dto';
import { ChildService } from '../services/child-service';
export declare class ChildController {
    private readonly childService;
    constructor(childService: ChildService);
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
}
