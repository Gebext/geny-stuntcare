import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class AuthService {
  // Inisialisasi logger untuk AuthService
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, pass: string) {
    this.logger.log(`Menerima percobaan login untuk: ${identifier}`);

    // 1. Validasi awal password dari FE
    if (!pass) {
      this.logger.warn(
        `Login gagal: Password tidak disertakan untuk ${identifier}`,
      );
      throw new UnauthorizedException('Email/No. HP atau password salah');
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { phone: identifier }],
        },
        include: {
          roles: {
            include: { role: true },
          },
        },
      });

      // 2. Cek apakah user ada DAN punya passwordHash
      if (!user) {
        this.logger.warn(
          `Login gagal: User dengan identifier ${identifier} tidak ditemukan`,
        );
        throw new UnauthorizedException('Email/No. HP atau password salah');
      }

      if (!user.passwordHash) {
        this.logger.warn(
          `Login gagal: User ${identifier} mencoba login via password tapi akun menggunakan Social Login`,
        );
        throw new UnauthorizedException('Metode login tidak sesuai');
      }

      // 3. Verifikasi Password dengan bcrypt
      const isMatch = await bcrypt.compare(pass, user.passwordHash);

      if (!isMatch) {
        this.logger.warn(`Login gagal: Password salah untuk ${identifier}`);
        throw new UnauthorizedException('Email/No. HP atau password salah');
      }

      // 4. Generate Token
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles.map((ur) => ur.role.name),
      };

      this.logger.log(
        `Login berhasil: User ID ${user.id} (${user.email}) telah diautentikasi`,
      );

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // Mencatat error sistem (misal: database down)
      this.logger.error(
        `Error pada proses login untuk ${identifier}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
