import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { KaderDashboardService } from './kader.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('dashboard/kader')
@UseGuards(JwtAuthGuard)
export class KaderDashboardController {
  constructor(private readonly kaderService: KaderDashboardService) {}

  @Get('summary')
  async getFullDashboard(@Request() req) {
    const userId = req.user.id;

    // Eksekusi semua secara paralel agar cepat
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
}
