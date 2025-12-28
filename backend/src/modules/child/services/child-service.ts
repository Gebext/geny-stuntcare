import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ChildFilterDto, CreateChildDto } from '../dtos/create-child.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class ChildService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id },
      include: {
        mother: {
          include: {
            user: {
              select: { name: true, phone: true },
            },
            environment: true,
          },
        },
        // Riwayat Timbangan & Tinggi (Anthropometry)
        anthropometries: {
          orderBy: { measurementDate: 'desc' },
        },
        // Riwayat Imunisasi
        immunizations: {
          orderBy: { dateGiven: 'desc' },
        },
        // Riwayat Nutrisi/Makanan
        nutritionHistories: {
          orderBy: { recordedAt: 'desc' },
        },
        // Riwayat Kesehatan/Penyakit
        healthHistories: {
          orderBy: { diagnosisDate: 'desc' },
        },
        // Hasil Analisis AI jika sudah ada
        aiResults: {
          orderBy: { generatedAt: 'desc' },
          take: 1,
          include: { recommendations: true },
        },
      },
    });

    if (!child) {
      throw new NotFoundException(`Data anak dengan ID ${id} tidak ditemukan`);
    }

    // Format response agar lebih informatif bagi Kader/Admin
    return {
      ...child,
      motherName: child.mother?.user?.name || 'Tidak diketahui',
      contactMother: child.mother?.user?.phone || 'Tidak ada nomor',
      // Status Kelengkapan Data
      summary: {
        totalMeasurements: child.anthropometries.length,
        totalVaccines: child.immunizations.length,
        lastDiagnosis:
          child.healthHistories[0]?.diseaseName || 'Sehat/Tidak ada record',
        isVerified: child.isVerified,
      },
    };
  }

  async findAll(query: ChildFilterDto) {
    const { name, gender, stuntingRisk, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (gender) {
      where.gender = gender;
    }
    if (stuntingRisk) {
      where.stuntingRisk = stuntingRisk;
    }

    const [data, total] = await Promise.all([
      this.prisma.childProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          mother: {
            include: {
              user: {
                select: { name: true }, // Nama Ibu diambil dari tabel User
              },
              environment: true,
            },
          },
          anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.childProfile.count({ where }),
    ]);

    // Kita mapping sedikit agar response-nya lebih cantik (tidak terlalu bersarang)
    const formattedData = data.map((item) => ({
      ...item,
      motherName: item.mother?.user?.name || 'Tidak diketahui',
    }));

    return {
      data: formattedData,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async createChild(userId: string, dto: CreateChildDto) {
    const motherProfile = await this.prisma.motherProfile.findUnique({
      where: { userId },
    });

    if (!motherProfile) {
      throw new NotFoundException('Lengkapi profil Ibu terlebih dahulu.');
    }

    const existing = await this.prisma.childProfile.findFirst({
      where: {
        motherId: motherProfile.id,
        name: { equals: dto.name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Anak dengan nama ${dto.name} sudah terdaftar.`,
      );
    }

    return this.prisma.childProfile.create({
      data: {
        name: dto.name,
        gender: dto.gender,
        birthDate: new Date(dto.birthDate),
        birthWeight: dto.birthWeight,
        birthLength: dto.birthLength,
        asiExclusive: dto.asiExclusive,
        motherId: motherProfile.id,
      },
    });
  }

  async updateChild(userId: string, childId: string, dto: any) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
      include: { mother: true },
    });

    if (!child || child.mother.userId !== userId) {
      throw new NotFoundException('Data anak tidak ditemukan.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, motherId, ...updateData } = dto;

    // Casting ke any karena isVerified mungkin tidak ada di base type Prisma
    if ((child as any).isVerified) {
      throw new ForbiddenException(
        'Data sudah diverifikasi Kader dan tidak dapat diubah.',
      );
    }

    return this.prisma.childProfile.update({
      where: { id: childId },
      data: {
        ...updateData,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : child.birthDate,
      },
    });
  }

  async verifyByKader(childId: string, risk: string) {
    const check = await this.prisma.childProfile.findUnique({
      where: { id: childId },
    });
    if (!check) throw new NotFoundException('Anak tidak ditemukan');

    return (this.prisma.childProfile as any).update({
      where: { id: childId },
      data: {
        isVerified: true,
        stuntingRisk: risk,
      },
    });
  }

  async getMyChildren(userId: string) {
    return this.prisma.childProfile.findMany({
      where: { mother: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
