import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateHealthHistoryDto } from '../dtos/create-health-history.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async addRecord(userId: string, dto: CreateHealthHistoryDto) {
    // 1. Validasi Anak dan relasi Ibu
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // 2. Cek User dan Role langsung ke database (lebih aman)
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat kesehatan anak ini.',
      );
    }

    // 3. Simpan Riwayat Penyakit
    return this.prisma.healthHistory.create({
      data: {
        childId: dto.childId,
        diseaseName: dto.diseaseName,
        isChronic: dto.isChronic,
        diagnosisDate: new Date(dto.diagnosisDate),
      },
    });
  }

  async getHistory(childId: string) {
    // Pastikan anak ada sebelum tarik history
    const childExists = await this.prisma.childProfile.findUnique({
      where: { id: childId },
    });

    if (!childExists) throw new NotFoundException('Data anak tidak ditemukan');

    return this.prisma.healthHistory.findMany({
      where: { childId },
      orderBy: { diagnosisDate: 'desc' },
    });
  }
}
