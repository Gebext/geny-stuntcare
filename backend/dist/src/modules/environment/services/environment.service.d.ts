import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class EnvironmentService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertEnvironment(userId: string, roles: number[], dto: CreateEnvironmentDto): Promise<any>;
    getByMother(motherId: string): Promise<any>;
}
