import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  async addRecord(userId: string, dto: CreateNutritionDto) {
    // 1. Validasi keberadaan Anak dan relasi Ibunya
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // 2. Ambil data User yang login beserta Role-nya
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    // 3. Logic Proteksi: Kader (Global) atau Ibu (Pemilik Anak)
    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat nutrisi anak ini.',
      );
    }

    // 4. Simpan Record Nutrisi
    return this.prisma.nutritionHistory.create({
      data: {
        childId: dto.childId,
        foodType: dto.foodType,
        frequencyPerDay: dto.frequencyPerDay,
        proteinSource: dto.proteinSource,
        recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
      },
    });
  }

  async getHistory(childId: string) {
    // Cari data anak dulu untuk memastikan datanya ada
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
    });
    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    return this.prisma.nutritionHistory.findMany({
      where: { childId },
      orderBy: { recordedAt: 'desc' },
    });
  }
}
