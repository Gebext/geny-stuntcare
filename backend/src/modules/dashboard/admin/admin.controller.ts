import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';

@Controller('dashboard/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Hanya User dengan role ADMIN yang bisa tembus
export class AdminDashboardController {
  constructor(private readonly adminService: AdminDashboardService) {}

  @Get('children')
  async getAllChildren(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('riskStatus') riskStatus?: string,
  ) {
    const result = await this.adminService.getAllChildren({
      page,
      limit,
      search,
      riskStatus,
    });

    return {
      success: true,
      message: 'Berhasil mengambil data anak dengan filter',
      data: result.list,
      meta: result.meta,
    };
  }

  @Get('children/:id')
  async getChildDetail(@Param('id') id: string) {
    const data = await this.adminService.getChildById(id);
    return {
      success: true,
      message: 'Detail anak berhasil ditarik',
      data,
    };
  }

  @Get('summary')
  async getSummary() {
    const stats = await this.adminService.getMainStats();
    const performance = await this.adminService.getKaderPerformance();

    return {
      success: true,
      message: 'Data dashboard admin berhasil ditarik.',
      data: {
        ...stats,
        kaderPerformance: performance,
      },
    };
  }
}
