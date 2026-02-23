import { ImmunizationService } from '../services/immunization.service';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
import { UpdateImmunizationDto } from '../dtos/update-immunization.dto';
export declare class ImmunizationController {
    private readonly service;
    constructor(service: ImmunizationService);
    create(req: any, dto: CreateImmunizationDto): Promise<{
        id: string;
        childId: string;
        vaccineName: string;
        status: string;
        dateGiven: Date;
    }>;
    update(req: any, id: string, dto: UpdateImmunizationDto): Promise<{
        id: string;
        childId: string;
        vaccineName: string;
        status: string;
        dateGiven: Date;
    }>;
    getHistory(childId: string): Promise<({
        child: {
            name: string;
        };
    } & {
        id: string;
        childId: string;
        vaccineName: string;
        status: string;
        dateGiven: Date;
    })[]>;
}
