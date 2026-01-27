import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MotherModule } from './modules/mother/mother.module';
import { ChildModule } from './modules/child/child.module';
import { AnthropometryModule } from './modules/anthropometry/anthropometry.module';
import { ImmunizationModule } from './modules/immunization/immunization.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { HealthModule } from './modules/health/health.module';
import { EnvironmentModule } from './modules/environment/environment.module';
import { ChatModule } from './modules/chat/chat.module';
import { AiModule } from './modules/ai/ai.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    // Tambahkan .register() di sini agar endpoint /metrics aktif secara otomatis
    PrometheusModule.register(),

    PrismaModule,
    UserModule,
    AuthModule,
    MotherModule,
    ChildModule,
    AnthropometryModule,
    ImmunizationModule,
    NutritionModule,
    HealthModule,
    EnvironmentModule,
    ChatModule,
    AiModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
