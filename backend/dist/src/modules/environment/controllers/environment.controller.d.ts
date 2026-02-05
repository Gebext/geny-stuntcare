import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
export declare class EnvironmentController {
    private readonly service;
    constructor(service: EnvironmentService);
    upsert(req: any, dto: CreateEnvironmentDto): Promise<{
        id: string;
        motherId: string;
        cleanWater: boolean;
        sanitation: string;
        distanceFaskesKm: number;
        transportation: string;
    }>;
    get(motherId: string): Promise<{
        id: string;
        motherId: string;
        cleanWater: boolean;
        sanitation: string;
        distanceFaskesKm: number;
        transportation: string;
    }>;
}
