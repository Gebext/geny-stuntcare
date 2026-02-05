import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { CreateMotherProfileDto } from '../dtos/create-mother-profile.dto';

@Injectable()
export class MotherService {
  private readonly logger = new Logger(MotherService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * IBU: Simpan atau Update Profil
   */
  async upsertProfile(userId: string, dto: CreateMotherProfileDto) {
    this.logger.log(
      `[UPSERT PROFILE] Memproses profil untuk User ID: ${userId}`,
    );

    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    const isMother = user.roles.some((ur: any) => ur.role.name === 'MOTHER');
    if (!isMother) {
      this.logger.warn(
        `[FORBIDDEN] User ${userId} bukan MOTHER tapi mencoba akses profil Ibu`,
      );
      throw new ForbiddenException('Hanya akun Ibu yang dapat memiliki profil');
    }

    const result = await this.prisma.motherProfile.upsert({
      where: { userId },
      update: { ...dto },
      create: { userId, ...dto },
    });

    this.logger.log(`[SUCCESS] Profil Ibu ID ${result.id} berhasil diperbarui`);
    return result;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.motherProfile.findUnique({
      where: { userId },
      include: { environment: true, childProfiles: true },
    });
    if (!profile) throw new NotFoundException('Profil belum diisi');
    return profile;
  }

  /**
   * KADER: List Ibu & Detail Anak (Tampilan Hirarki)
   */
  async getAssignedMothers(kaderId: string) {
    this.logger.log(
      `[DASHBOARD KADER] Fetching hirarki data untuk Kader: ${kaderId}`,
    );

    const assignments = await (this.prisma as any).kaderAssignment.findMany({
      where: { kaderId },
      include: {
        mother: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
            childProfiles: {
              include: {
                anthropometries: {
                  orderBy: { measurementDate: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return assignments.map((asg: any) => {
      const mother = asg.mother;
      const children = mother.childProfiles.map((child: any) => {
        const lastAnthro = child.anthropometries?.[0];
        // Logika: Jika sudah > 30 hari sejak timbang terakhir, maka perlu dicek
        const needsCheck = lastAnthro
          ? (Date.now() - new Date(lastAnthro.measurementDate).getTime()) /
              (1000 * 60 * 60 * 24) >
            30
          : true;

        return {
          childId: child.id,
          childName: child.name,
          needsCheck,
          lastWeight: lastAnthro?.weightKg || 0,
          lastHeight: lastAnthro?.heightCm || 0,
        };
      });

      return {
        motherId: mother.id,
        motherName: mother.user.name,
        phone: mother.user.phone,
        children,
      };
    });
  }

  /**
   * KADER: List Semua Balita Binaan (Tampilan Flat / List Table)
   */
  async getAssignedChildren(
    kaderId: string,
    query: {
      name?: string;
      gender?: string;
      stuntingRisk?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { name, gender, stuntingRisk, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    this.logger.log(
      `[KADER LIST] Fetching flat children list untuk Kader: ${kaderId}`,
    );

    const where: any = {
      mother: {
        kaderAssignments: { some: { kaderId } },
      },
    };

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (gender) where.gender = gender;
    if (stuntingRisk) where.stuntingRisk = stuntingRisk;

    const [children, total] = await Promise.all([
      (this.prisma as any).childProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          mother: { include: { user: { select: { name: true } } } },
          anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        },
        orderBy: { name: 'asc' },
      }),
      (this.prisma as any).childProfile.count({ where }),
    ]);

    return {
      data: children.map((child) => ({
        id: child.id,
        name: child.name,
        gender: child.gender,
        stuntingRisk: child.stuntingRisk,
        motherName: child.mother.user.name,
        isVerified: child.isVerified, // Field verifikasi dari model childProfile
        lastMeasured: child.anthropometries?.[0]?.measurementDate || null,
      })),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /**
   * ADMIN: Assign Kader ke Ibu
   */
  async assignMotherToKader(kaderId: string, motherId: string) {
    this.logger.log(`[ADMIN] Assigning Mother ${motherId} to Kader ${kaderId}`);

    const kader: any = await this.prisma.user.findUnique({
      where: { id: kaderId },
      include: { roles: { include: { role: true } } },
    });

    if (!kader || !kader.roles.some((r: any) => r.role.name === 'KADER')) {
      throw new ForbiddenException(
        'User yang dipilih bukan Kader atau tidak ditemukan',
      );
    }

    const existing = await (this.prisma as any).kaderAssignment.findFirst({
      where: { motherId },
    });

    if (existing) {
      this.logger.log(
        `[ADMIN] Updating existing assignment for Mother ${motherId}`,
      );
      return (this.prisma as any).kaderAssignment.update({
        where: { id: existing.id },
        data: { kaderId },
      });
    }

    return (this.prisma as any).kaderAssignment.create({
      data: { kaderId, motherId },
    });
  }

  /**
   * ADMIN: Monitoring Semua Profil Ibu
   */
  async getAllMothers(query: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    const { page, limit, search, status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    this.logger.log(`[ADMIN] Fetching all mothers search: ${search || 'none'}`);

    if (search) {
      where.user = { name: { contains: search, mode: 'insensitive' } };
    }
    if (status === 'ASSIGNED') where.kaderAssignments = { some: {} };
    if (status === 'UNASSIGNED') where.kaderAssignments = { none: {} };

    const [data, total] = await Promise.all([
      (this.prisma as any).motherProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, phone: true } },
          kaderAssignments: { include: { kader: { select: { name: true } } } },
          _count: { select: { childProfiles: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).motherProfile.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
    };
  }

  /**
   * ADMIN: Unassign Kader
   */
  async unassignMotherFromKader(motherId: string) {
    this.logger.warn(`[ADMIN] Unassigning Kader from Mother ID: ${motherId}`);

    const assignment = await (this.prisma as any).kaderAssignment.findFirst({
      where: { motherId },
    });
    if (!assignment)
      throw new NotFoundException('Data penugasan tidak ditemukan');

    return (this.prisma as any).kaderAssignment.delete({
      where: { id: assignment.id },
    });
  }
}
