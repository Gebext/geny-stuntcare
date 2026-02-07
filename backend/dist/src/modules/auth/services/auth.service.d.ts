import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(identifier: string, pass: string): Promise<{
        access_token: string;
    }>;
}
