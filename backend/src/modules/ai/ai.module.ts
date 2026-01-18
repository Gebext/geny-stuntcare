// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // Export jika modul lain butuh pakai logic AI
})
export class AiModule {}
