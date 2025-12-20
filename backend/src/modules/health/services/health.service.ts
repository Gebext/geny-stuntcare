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

  async addRecord(
    userId: string,
    roles: number[],
    dto: CreateHealthHistoryDto,
  ) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    const isKader = roles.includes(2);
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat kesehatan ini.',
      );
    }

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
    return this.prisma.healthHistory.findMany({
      where: { childId },
      orderBy: { diagnosisDate: 'desc' },
    });
  }
}
