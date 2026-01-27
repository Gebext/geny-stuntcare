import { ChildFilterDto, CreateChildDto } from '../dtos/create-child.dto';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class ChildService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<any>;
    findAll(query: ChildFilterDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
    createChild(userId: string, dto: CreateChildDto): Promise<any>;
    updateChild(userId: string, childId: string, dto: any): Promise<any>;
    verifyByKader(childId: string, risk: string): Promise<any>;
    getMyChildren(userId: string): Promise<any>;
}
