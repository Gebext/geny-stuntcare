import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';

@Injectable()
export class ImmunizationService {
  constructor(private prisma: PrismaService) {}

  async addRecord(userId: string, roles: number[], dto: CreateImmunizationDto) {
    // Gunakan roles dari JWT
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // Cek apakah user adalah Kader (2) atau Ibu pemilik anak tersebut
    const isKader = roles.includes(2);
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat imunisasi ini.',
      );
    }

    return this.prisma.immunization.create({
      data: {
        childId: dto.childId,
        vaccineName: dto.vaccineName,
        status: dto.status,
        dateGiven: new Date(dto.dateGiven),
      },
    });
  }

  async getChildHistory(childId: string) {
    return this.prisma.immunization.findMany({
      where: { childId },
      orderBy: { dateGiven: 'desc' },
    });
  }
}
