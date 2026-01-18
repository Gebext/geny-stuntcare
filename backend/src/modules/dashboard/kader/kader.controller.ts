import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { KaderDashboardService } from './kader.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('dashboard/kader')
@UseGuards(JwtAuthGuard)
export class KaderDashboardController {
  constructor(private readonly kaderService: KaderDashboardService) {}

  // Widget Summary Dashboard (Statistik Utama)
  @Get('summary')
  async getFullDashboard(@Request() req) {
    const userId = req.user.id;
    const [stats, pending, activities, distribution] = await Promise.all([
      this.kaderService.getStats(userId),
      this.kaderService.getPendingMeasurements(userId),
      this.kaderService.getRecentActivities(userId),
      this.kaderService.getRiskDistribution(userId),
    ]);

    return {
      stats,
      pendingMeasurements: pending,
      recentActivities: activities,
      riskDistribution: distribution,
    };
  }

  // Daftar khusus Anak yang Belum Diukur (dengan Pagination)
  @Get('pending-measurements')
  async getPending(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const kaderId = req.user.id;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    const result = await this.kaderService.getPendingList(
      kaderId,
      pageNum,
      limitNum,
    );
    return { success: true, ...result };
  }

  // Daftar Agenda Prioritas/Reminder (dengan Pagination)
  @Get('priority-agenda')
  async getAgenda(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const kaderId = req.user.id;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const result = await this.kaderService.getPriorityAgenda(
      kaderId,
      pageNumber,
      limitNumber,
    );
    return {
      success: true,
      message:
        result.data.length > 0
          ? 'Daftar pengingat berhasil dimuat'
          : 'Tidak ada agenda prioritas',
      ...result,
    };
  }
}
