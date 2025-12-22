import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEnvironmentDto } from '../dtos/create-environment.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class EnvironmentService {
  constructor(private prisma: PrismaService) {}

  async upsertEnvironment(
    userId: string,
    roles: number[],
    dto: CreateEnvironmentDto,
  ) {
    const mother = await this.prisma.motherProfile.findUnique({
      where: { id: dto.motherId },
    });

    if (!mother) throw new NotFoundException('Profil Ibu tidak ditemukan');

    // Proteksi: Kader (2) atau Ibu itu sendiri (3)
    const isKader = roles.includes(2);
    const isOwner = mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Anda tidak diizinkan mengubah data lingkungan ini.',
      );
    }

    // Gunakan upsert karena motherId bersifat @unique (satu ibu satu data lingkungan)
    return this.prisma.environmentData.upsert({
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
  }

  async getByMother(motherId: string) {
    return this.prisma.environmentData.findUnique({
      where: { motherId },
    });
  }
}
