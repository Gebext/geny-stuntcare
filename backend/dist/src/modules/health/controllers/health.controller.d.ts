import { HealthService } from '../services/health.service';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
export declare class HealthController {
    private readonly service;
    constructor(service: HealthService);
    create(req: any, dto: CreateHealthHistoryDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
