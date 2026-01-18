import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class KaderDashboardService {
  constructor(private prisma: PrismaService) {}

  // Helper untuk ambil list Mother ID binaan kader
  private async getMotherIds(kaderId: string) {
    const assignments = await this.prisma.kaderAssignment.findMany({
      where: { kaderId },
      select: { motherId: true },
    });
    return assignments.map((a) => a.motherId);
  }

  async getStats(kaderId: string) {
    const motherIds = await this.getMotherIds(kaderId);
    const [totalAnak, diukurCount, stuntingCount] = await Promise.all([
      this.prisma.childProfile.count({
        where: { motherId: { in: motherIds } },
      }),
      this.prisma.anthropometry.count({
        where: {
          child: { motherId: { in: motherIds } },
          measurementDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.aiAnalysis.count({
        where: { child: { motherId: { in: motherIds } }, score: { lt: 60 } },
      }),
    ]);

    return {
      totalAnak,
      pengukuranBulanIni: `${diukurCount}/${totalAnak}`,
      indikasiStunting: stuntingCount,
    };
  }

  async getPendingMeasurements(kaderId: string) {
    const motherIds = await this.getMotherIds(kaderId);
    return this.prisma.childProfile.findMany({
      where: {
        motherId: { in: motherIds },
        anthropometries: {
          none: {
            measurementDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      },
      include: {
        mother: { include: { user: { select: { name: true, phone: true } } } },
      },
    });
  }

  async getRecentActivities(kaderId: string) {
    // Menampilkan 5 aktivitas pengukuran terakhir di wilayah binaan
    const motherIds = await this.getMotherIds(kaderId);
    return this.prisma.anthropometry.findMany({
      where: { child: { motherId: { in: motherIds } } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { child: { select: { name: true } } },
    });
  }

  async getRiskDistribution(kaderId: string) {
    const motherIds = await this.getMotherIds(kaderId);
    const stats = await this.prisma.aiAnalysis.groupBy({
      by: ['status'],
      where: { child: { motherId: { in: motherIds } } },
      _count: { id: true },
    });
    return stats.map((s) => ({ label: s.status, value: s._count.id }));
  }
}
