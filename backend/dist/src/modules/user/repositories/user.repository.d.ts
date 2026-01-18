import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prismaservice';
export type UserWithoutHash = Omit<User, 'passwordHash'>;
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private getUserSelect;
    create(data: any): Promise<UserWithoutHash>;
    findAll(): Promise<UserWithoutHash[]>;
    findOneById(id: string): Promise<UserWithoutHash | null>;
    update(id: string, data: any): Promise<UserWithoutHash>;
    remove(id: string): Promise<UserWithoutHash>;
    findManyAndCount(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<[UserWithoutHash[], number]>;
}
