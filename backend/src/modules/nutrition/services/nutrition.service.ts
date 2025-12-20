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

  async addRecord(userId: string, roles: number[], dto: CreateNutritionDto) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // Proteksi: Hanya Kader atau Ibu pemilik anak
    const isKader = roles.includes(2);
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat nutrisi ini.',
      );
    }

    return this.prisma.nutritionHistory.create({
      data: {
        childId: dto.childId,
        foodType: dto.foodType,
        frequencyPerDay: dto.frequencyPerDay,
        proteinSource: dto.proteinSource,
        recordedAt: new Date(dto.recordedAt),
      },
    });
  }

  async getHistory(childId: string) {
    return this.prisma.nutritionHistory.findMany({
      where: { childId },
      orderBy: { recordedAt: 'desc' },
    });
  }
}
