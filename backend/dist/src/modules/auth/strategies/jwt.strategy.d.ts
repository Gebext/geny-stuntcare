import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prismaservice';
declare const JwtStrategy_base: new (...args: unknown[] | [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        roles: ({
            role: {
                id: number;
                name: string;
            };
        } & {
            userId: string;
            roleId: number;
        })[];
    } & {
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
