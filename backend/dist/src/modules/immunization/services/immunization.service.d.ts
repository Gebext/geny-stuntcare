import { PrismaService } from 'src/prisma/prismaservice';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
export declare class ImmunizationService {
    private prisma;
    constructor(prisma: PrismaService);
    addRecord(userId: string, dto: CreateImmunizationDto): Promise<any>;
    getChildHistory(childId: string): Promise<any>;
}
