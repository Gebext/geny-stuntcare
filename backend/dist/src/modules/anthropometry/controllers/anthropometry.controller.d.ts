import { AnthropometryService } from '../services/anthropometry.service';
import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { UpdateAnthropometryDto } from '../dtos/update-anthropometry.dto';
export declare class AnthropometryController {
    private readonly service;
    constructor(service: AnthropometryService);
    create(req: any, dto: CreateAnthropometryDto): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        headCircumferenceCm: number;
        armCircumferenceCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }>;
    update(req: any, id: string, dto: UpdateAnthropometryDto): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        headCircumferenceCm: number;
        armCircumferenceCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }>;
    getHistory(childId: string): Promise<{
        id: string;
        childId: string;
        weightKg: number;
        heightCm: number;
        headCircumferenceCm: number;
        armCircumferenceCm: number;
        ageMonth: number;
        measuredBy: string;
        measurementDate: Date;
        verified: boolean;
        createdAt: Date;
    }[]>;
}
