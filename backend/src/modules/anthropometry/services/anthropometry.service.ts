import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class AnthropometryService {
  constructor(private prisma: PrismaService) {}

  async recordMeasurement(
    userId: string,
    userName: string,
    roles: number[],
    dto: CreateAnthropometryDto,
  ) {
    // 1. Ambil data anak untuk dapatkan birthDate
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');

    // 2. Cek kepemilikan jika yang input adalah Ibu
    const isKader = roles.includes(2); // ID 2 adalah KADER
    const isMotherOwner = child.mother.userId === userId;

    if (!isKader && !isMotherOwner) {
      throw new ForbiddenException(
        'Anda tidak diizinkan mencatat data untuk anak ini.',
      );
    }

    // 3. Hitung Selisih Bulan (Age in Months)
    const birth = new Date(child.birthDate);
    const measure = new Date(dto.measurementDate);
    const ageMonth =
      (measure.getFullYear() - birth.getFullYear()) * 12 +
      (measure.getMonth() - birth.getMonth());

    // 4. Simpan Data
    return this.prisma.anthropometry.create({
      data: {
        childId: dto.childId,
        weightKg: dto.weightKg,
        heightCm: dto.heightCm,
        ageMonth: ageMonth < 0 ? 0 : ageMonth, // Cegah nilai negatif
        measuredBy: userName,
        measurementDate: measure,
        verified: isKader, // Otomatis True jika Kader, False jika Ibu
      },
    });
  }

  async getHistoryByChild(childId: string) {
    return this.prisma.anthropometry.findMany({
      where: { childId },
      orderBy: { measurementDate: 'desc' },
    });
  }
}
