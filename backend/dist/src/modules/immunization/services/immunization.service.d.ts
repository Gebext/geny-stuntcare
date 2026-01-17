import { PrismaService } from 'src/prisma/prismaservice';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
export declare class ImmunizationService {
    private prisma;
    constructor(prisma: PrismaService);
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
