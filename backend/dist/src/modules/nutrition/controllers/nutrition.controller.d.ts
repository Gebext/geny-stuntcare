import { NutritionService } from '../services/nutrition.service';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
export declare class NutritionController {
    private readonly service;
    constructor(service: NutritionService);
    create(req: any, dto: CreateNutritionDto): Promise<{
        id: string;
        childId: string;
        foodType: string;
        frequencyPerDay: number;
        proteinSource: string;
        recordedAt: Date;
    }>;
    getHistory(childId: string): Promise<{
        id: string;
        childId: string;
        foodType: string;
        frequencyPerDay: number;
        proteinSource: string;
        recordedAt: Date;
    }[]>;
}
