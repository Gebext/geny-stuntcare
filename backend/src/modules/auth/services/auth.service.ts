import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Validasi awal: Jika password tidak dikirim sama sekali oleh FE
    if (!pass) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { 
        roles: { 
          include: { role: true } 
        } 
      },
    });

    // 2. Cek apakah user ada DAN punya passwordHash
    // (Jika user.passwordHash null, berarti dia user social login)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // 3. Sekarang aman untuk memanggil bcrypt karena pass dan hash pasti string
    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      roles: user.roles.map(ur => ur.role.name) 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}