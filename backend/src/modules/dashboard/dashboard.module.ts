import { Module } from '@nestjs/common';
import { KaderDashboardController } from './kader/kader.controller';
import { KaderDashboardService } from './kader/kader.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminDashboardController } from './admin/admin.controller';
import { AdminDashboardService } from './admin/admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    KaderDashboardController,
    // MotherDashboardController, (Next Step)
    AdminDashboardController,
  ],
  providers: [
    KaderDashboardService,
    // MotherDashboardService, (Next Step)
    AdminDashboardService,
  ],
})
export class DashboardModule {}
