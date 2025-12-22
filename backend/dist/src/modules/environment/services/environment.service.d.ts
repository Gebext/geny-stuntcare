import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class EnvironmentService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertEnvironment(userId: string, roles: number[], dto: CreateEnvironmentDto): Promise<{
        id: string;
        motherId: string;
        cleanWater: boolean;
        sanitation: string;
        distanceFaskesKm: number;
        transportation: string;
    }>;
    getByMother(motherId: string): Promise<{
        id: string;
        motherId: string;
        cleanWater: boolean;
        sanitation: string;
        distanceFaskesKm: number;
        transportation: string;
    }>;
}
