import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getMainStats() {
    // Mengambil data fundamental sistem
    const [counts, aiStats, recentUsers] = await Promise.all([
      // 1. Agregasi counts dasar
      this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.childProfile.count(),
        this.prisma.motherProfile.count(),
        // Menghitung user yang punya role 'KADER' (asumsi roleId 2 adalah Kader)
        this.prisma.userRole.count({ where: { role: { name: 'KADER' } } }),
      ]),

      // 2. Agregasi Risk dari AiAnalysis
      this.prisma.aiAnalysis.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // 3. User yang baru bergabung (Aktivitas Sistem)
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, email: true, createdAt: true },
      }),
    ]);

    return {
      overview: {
        totalUsers: counts[0],
        totalAnak: counts[1],
        totalIbu: counts[2],
        totalKader: counts[3],
      },
      stuntingDistribution: aiStats.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      recentRegistrations: recentUsers,
    };
  }

  async getKaderPerformance() {
    // Melacak kader mana yang paling aktif melakukan pendampingan (KaderAssignment)
    const performance = await this.prisma.user.findMany({
      where: {
        roles: { some: { role: { name: 'KADER' } } },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { kaderAssignments: true },
        },
      },
      orderBy: {
        kaderAssignments: { _count: 'desc' },
      },
      take: 10,
    });

    return performance.map((kader) => ({
      namaKader: kader.name,
      jumlahIbuDibina: kader._count.kaderAssignments,
    }));
  }

  // Tambahkan parameter di getAllChildren
  async getAllChildren(query: {
    page?: any;
    limit?: any;
    search?: string;
    riskStatus?: string;
    gender?: string; // Filter baru
    isVerified?: string; // Filter baru
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    // 1. Search (Nama Anak / Nama Ibu)
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        {
          mother: {
            user: { name: { contains: query.search, mode: 'insensitive' } },
          },
        },
      ];
    }

    // 2. Filter Risiko AI
    if (query.riskStatus) {
      where.aiAnalysis = {
        status: { contains: query.riskStatus, mode: 'insensitive' },
      };
    }

    // 3. Filter Gender (L/P)
    if (query.gender) {
      where.gender = query.gender;
    }

    // 4. Filter Verifikasi (True/False)
    if (query.isVerified !== undefined && query.isVerified !== '') {
      where.isVerified = query.isVerified === 'true';
    }

    const [data, total] = await Promise.all([
      this.prisma.childProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          mother: {
            include: { user: { select: { name: true, phone: true } } },
          },
          aiAnalysis: true,
          anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.childProfile.count({ where }),
    ]);

    return {
      list: data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Bonus: Get Single Child Detail jika Admin klik salah satu anak
  async getChildById(id: string) {
    const child = await this.prisma.childProfile.findUnique({
      where: { id },
      include: {
        mother: { include: { user: true, environment: true } },
        anthropometries: { orderBy: { measurementDate: 'desc' } },
        immunizations: true,
        nutritionHistories: true,
        healthHistories: true,
        aiAnalysis: true,
      },
    });

    if (!child) throw new NotFoundException('Data anak tidak ditemukan');
    return child;
  }
}
