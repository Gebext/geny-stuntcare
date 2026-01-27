import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class AnthropometryService {
    private prisma;
    constructor(prisma: PrismaService);
    recordMeasurement(userId: string, userName: string, roles: number[], dto: CreateAnthropometryDto): Promise<any>;
    getHistoryByChild(childId: string): Promise<any>;
}
