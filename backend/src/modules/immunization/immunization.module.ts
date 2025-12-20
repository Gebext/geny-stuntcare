import { Module } from '@nestjs/common';
import { ImmunizationService } from './services/immunization.service';
import { ImmunizationController } from './controllers/immunization.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImmunizationController],
  providers: [ImmunizationService],
  exports: [ImmunizationService],
})
export class ImmunizationModule {}
