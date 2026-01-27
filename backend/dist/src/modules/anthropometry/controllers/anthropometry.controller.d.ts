import { AnthropometryService } from '../services/anthropometry.service';
import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
export declare class AnthropometryController {
    private readonly service;
    constructor(service: AnthropometryService);
    create(req: any, dto: CreateAnthropometryDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
