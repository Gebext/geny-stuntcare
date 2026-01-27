import { ImmunizationService } from '../services/immunization.service';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
export declare class ImmunizationController {
    private readonly service;
    constructor(service: ImmunizationService);
    create(req: any, dto: CreateImmunizationDto): Promise<any>;
    getHistory(childId: string): Promise<any>;
}
