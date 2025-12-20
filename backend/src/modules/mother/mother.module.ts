import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module'; 
import { MotherController } from './controllers/mother.controller';
import { MotherService } from './services/mother.service';

@Module({
  imports: [PrismaModule],
  controllers: [MotherController],
  providers: [MotherService],
})
export class MotherModule {}