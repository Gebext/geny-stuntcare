import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
export declare class EnvironmentController {
    private readonly service;
    constructor(service: EnvironmentService);
    upsert(req: any, dto: CreateEnvironmentDto): Promise<any>;
    get(motherId: string): Promise<any>;
}
