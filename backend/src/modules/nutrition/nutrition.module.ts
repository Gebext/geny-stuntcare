import { Module } from '@nestjs/common';
import { NutritionService } from './services/nutrition.service';
import { NutritionController } from './controllers/nutrition.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NutritionController],
  providers: [NutritionService],
  exports: [NutritionService],
})
export class NutritionModule {}
