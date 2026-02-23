import { PrismaService } from 'src/prisma/prismaservice';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
import { UpdateImmunizationDto } from '../dtos/update-immunization.dto';
export declare class ImmunizationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    updateRecord(userId: string, recordId: string, dto: UpdateImmunizationDto): Promise<{
        id: string;
        childId: string;
        vaccineName: string;
        status: string;
        dateGiven: Date;
    }>;
    addRecord(userId: string, dto: CreateImmunizationDto): Promise<{
        id: string;
        childId: string;
        vaccineName: string;
        status: string;
        dateGiven: Date;
    }>;
    getChildHistory(childId: string): Promise<({
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
