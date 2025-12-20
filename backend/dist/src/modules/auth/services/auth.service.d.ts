import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prismaservice';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, pass: string): Promise<{
        access_token: string;
    }>;
}
