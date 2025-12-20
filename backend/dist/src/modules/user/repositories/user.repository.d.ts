import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaservice';
export type UserWithoutHash = Omit<User, 'passwordHash'>;
type PrismaCreateData = Omit<Prisma.UserCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'roles' | 'motherProfile' | 'chatSessions'> & {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
};
type PrismaUpdateData = Partial<PrismaCreateData>;
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: PrismaCreateData): Promise<UserWithoutHash>;
    findAll(): Promise<UserWithoutHash[]>;
    findOneById(id: string): Promise<UserWithoutHash | null>;
    update(id: string, data: PrismaUpdateData): Promise<UserWithoutHash>;
    remove(id: string): Promise<UserWithoutHash>;
    findManyAndCount(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<[UserWithoutHash[], number]>;
}
export {};
