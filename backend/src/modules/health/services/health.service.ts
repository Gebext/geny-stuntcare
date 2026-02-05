import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger, // 1. Import Logger
} from '@nestjs/common';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class HealthService {
  // 2. Inisialisasi Logger
  private readonly logger = new Logger(HealthService.name);

  constructor(private prisma: PrismaService) {}

  async addRecord(userId: string, dto: CreateHealthHistoryDto) {
    this.logger.log(
      `[CREATE] Mencatat riwayat kesehatan baru untuk Child ID: ${dto.childId}`,
    );

    // 1. Validasi Anak dan relasi Ibu
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) {
      this.logger.warn(
        `[NOT FOUND] Gagal mencatat. Child ID ${dto.childId} tidak ditemukan`,
      );
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    // 2. Cek User dan Role langsung ke database
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      this.logger.error(
        `[AUTH ERROR] User ID ${userId} tidak ditemukan di database`,
      );
      throw new NotFoundException('User tidak ditemukan');
    }

    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(
        `[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat kesehatan anak yang bukan haknya.`,
      );
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat kesehatan anak ini.',
      );
    }

    // 3. Simpan Riwayat Penyakit
    try {
      const record = await this.prisma.healthHistory.create({
        data: {
          childId: dto.childId,
          diseaseName: dto.diseaseName,
          isChronic: dto.isChronic,
          diagnosisDate: new Date(dto.diagnosisDate),
        },
      });

      this.logger.log(
        `[SUCCESS] Penyakit '${dto.diseaseName}' (Kronis: ${dto.isChronic}) berhasil dicatat untuk anak ${child.name}`,
      );
      return record;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal menyimpan riwayat kesehatan: ${error.message}`,
      );
      throw error;
    }
  }

  async getHistory(childId: string) {
    this.logger.log(`[FETCH] Mengambil riwayat kesehatan Child ID: ${childId}`);

    const childExists = await this.prisma.childProfile.findUnique({
      where: { id: childId },
    });

    if (!childExists) {
      this.logger.warn(
        `[NOT FOUND] Gagal ambil history. Child ID ${childId} tidak ada`,
      );
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    const histories = await this.prisma.healthHistory.findMany({
      where: { childId },
      orderBy: { diagnosisDate: 'desc' },
    });

    this.logger.log(
      `[FETCH SUCCESS] Ditemukan ${histories.length} catatan medis.`,
    );
    return histories;
  }
}
