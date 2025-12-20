import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateChildDto } from '../dtos/create-child.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class ChildService {
  constructor(private prisma: PrismaService) {}

  async createChild(userId: string, dto: CreateChildDto) {
    const motherProfile = await this.prisma.motherProfile.findUnique({
      where: { userId },
    });

    if (!motherProfile) {
      throw new NotFoundException('Lengkapi profil Ibu terlebih dahulu.');
    }

    // Proteksi 1: Cek nama duplikat (Case Insensitive)
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
        // isVerified otomatis default false dari schema
        // stuntingRisk otomatis default PENDING dari schema
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

    // PAKSA PAKAI ANY AGAR ERROR HILANG
    const childAny = child as any;

    if (childAny.isVerified) {
      throw new ForbiddenException(
        'Data sudah diverifikasi Kader dan tidak dapat diubah.',
      );
    }

    return this.prisma.childProfile.update({
      where: { id: childId },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : child.birthDate,
      },
    });
  }

  async verifyByKader(childId: string, risk: string) {
    // CEK DULU APAKAH ID ADA
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
