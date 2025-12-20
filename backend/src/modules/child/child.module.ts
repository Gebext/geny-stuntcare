import { Module } from '@nestjs/common';
import { ChildController } from './controllers/child.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Pastikan path PrismaModule benar
import { ChildService } from './services/child-service';

@Module({
  imports: [PrismaModule], // Wajib import ini agar ChildService bisa akses this.prisma
  controllers: [ChildController],
  providers: [ChildService],
  exports: [ChildService], // Export jika modul lain (seperti AI atau Reports) butuh data anak
})
export class ChildModule {}
