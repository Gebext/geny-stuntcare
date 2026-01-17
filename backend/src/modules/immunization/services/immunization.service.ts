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

  async addRecord(userId: string, dto: CreateImmunizationDto) {
    // 1. Cari data anak dan relasi ibunya
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // 2. Ambil data User yang sedang login beserta Role-nya
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    // 3. Logic Validasi:
    // - Apakah dia Kader?
    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    // - Apakah dia Ibu dari anak ini?
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mencatat imunisasi anak ini.',
      );
    }

    // 4. Eksekusi simpan data
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
      include: {
        child: {
          select: { name: true },
        },
      },
      orderBy: { dateGiven: 'desc' },
    });
  }
}
