import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger, // 1. Import Logger
} from '@nestjs/common';
import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class EnvironmentService {
  // 2. Inisialisasi Logger
  private readonly logger = new Logger(EnvironmentService.name);

  constructor(private prisma: PrismaService) {}

  async upsertEnvironment(
    userId: string,
    roles: number[],
    dto: CreateEnvironmentDto,
  ) {
    this.logger.log(
      `[UPSERT] Request update data lingkungan untuk Mother ID: ${dto.motherId}`,
    );

    const mother = await this.prisma.motherProfile.findUnique({
      where: { id: dto.motherId },
    });

    if (!mother) {
      this.logger.warn(
        `[NOT FOUND] Gagal update. Mother ID ${dto.motherId} tidak ditemukan`,
      );
      throw new NotFoundException('Profil Ibu tidak ditemukan');
    }

    // Proteksi: Kader (2) atau Ibu itu sendiri
    const isKader = roles.includes(2);
    const isOwner = mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(
        `[FORBIDDEN] User ID ${userId} mencoba mengakses data lingkungan milik Ibu ID ${dto.motherId} tanpa izin!`,
      );
      throw new ForbiddenException(
        'Anda tidak diizinkan mengubah data lingkungan ini.',
      );
    }

    try {
      // Gunakan upsert karena motherId bersifat @unique
      const result = await this.prisma.environmentData.upsert({
        where: { motherId: dto.motherId },
        update: {
          cleanWater: dto.cleanWater,
          sanitation: dto.sanitation,
          distanceFaskesKm: dto.distanceFaskesKm,
          transportation: dto.transportation,
        },
        create: {
          motherId: dto.motherId,
          cleanWater: dto.cleanWater,
          sanitation: dto.sanitation,
          distanceFaskesKm: dto.distanceFaskesKm,
          transportation: dto.transportation,
        },
      });

      this.logger.log(
        `[SUCCESS] Data lingkungan berhasil disimpan untuk Mother ID: ${dto.motherId}. Air Bersih: ${dto.cleanWater}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal melakukan upsert data lingkungan: ${error.message}`,
      );
      throw error;
    }
  }

  async getByMother(motherId: string) {
    this.logger.log(
      `[FETCH] Mengambil data lingkungan untuk Mother ID: ${motherId}`,
    );

    const data = await this.prisma.environmentData.findUnique({
      where: { motherId },
    });

    if (!data) {
      this.logger.warn(
        `[NOT FOUND] Data lingkungan untuk Mother ID ${motherId} belum diisi.`,
      );
    }

    return data;
  }
}
