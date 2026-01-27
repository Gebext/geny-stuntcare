import { NutritionService } from '../services/nutrition.service';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
export declare class NutritionController {
    private readonly service;
    constructor(service: NutritionService);
    create(req: any, dto: CreateNutritionDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
