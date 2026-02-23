import { HealthService } from '../services/health.service';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { UpdateHealthHistoryDto } from '../dtos/update-health-history.dto';
export declare class HealthController {
    private readonly service;
    constructor(service: HealthService);
    create(req: any, dto: CreateHealthHistoryDto): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }>;
    update(req: any, id: string, dto: UpdateHealthHistoryDto): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }>;
    getHistory(childId: string): Promise<{
        id: string;
        childId: string;
        diseaseName: string;
        diagnosisDate: Date;
        isChronic: boolean;
    }[]>;
}
