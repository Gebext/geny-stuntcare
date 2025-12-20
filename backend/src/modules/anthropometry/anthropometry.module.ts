import { Module } from '@nestjs/common';
import { AnthropometryService } from './services/anthropometry.service';
import { AnthropometryController } from './controllers/anthropometry.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnthropometryController],
  providers: [AnthropometryService],
  exports: [AnthropometryService],
})
export class AnthropometryModule {}
