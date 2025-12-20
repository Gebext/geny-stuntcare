import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKeyGeny2025', // Gunakan .env di produksi
    });
  }

  async validate(payload: any) {
    // Cari user di database beserta roles-nya untuk dicek oleh RolesGuard
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // Objek ini akan tersedia di req.user
  }
}