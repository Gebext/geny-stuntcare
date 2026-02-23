import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger, // 1. Import Logger
} from '@nestjs/common';
import { CreateAnthropometryDto } from '../dtos/create-anthropometry.dto';
import { UpdateAnthropometryDto } from '../dtos/update-anthropometry.dto';
import { PrismaService } from 'src/prisma/prismaservice';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnthropometryService {
  // 2. Inisialisasi Logger
  private readonly logger = new Logger(AnthropometryService.name);

  constructor(private prisma: PrismaService) {}

  async updateRecord(
    userId: string,
    roles: number[],
    recordId: string,
    dto: UpdateAnthropometryDto,
  ) {
    this.logger.log(
      `[UPDATE] Request update antropometri ID: ${recordId} oleh User: ${userId}`,
    );

    // 1. Ambil data yang akan diupdate
    const existing = await this.prisma.anthropometry.findUnique({
      where: { id: recordId },
      include: { child: { include: { mother: true } } },
    });

    if (!existing) {
      this.logger.warn(
        `[NOT FOUND] Data antropometri ID ${recordId} tidak ditemukan`,
      );
      throw new NotFoundException('Data antropometri tidak ditemukan');
    }

    // 2. Cek kepemilikan
    const isKader = roles.includes(2);
    const isMotherOwner = existing.child.mother.userId === userId;

    if (!isKader && !isMotherOwner) {
      this.logger.error(
        `[FORBIDDEN] User ${userId} mencoba update data antropometri anak orang lain!`,
      );
      throw new ForbiddenException(
        'Anda tidak diizinkan mengubah data ini.',
      );
    }

    // 3. Hitung ulang umur jika tanggal berubah
    const updateData: any = {};
    if (dto.weightKg !== undefined) updateData.weightKg = dto.weightKg;
    if (dto.heightCm !== undefined) updateData.heightCm = dto.heightCm;
    if (dto.headCircumferenceCm !== undefined)
      updateData.headCircumferenceCm = dto.headCircumferenceCm;
    if (dto.armCircumferenceCm !== undefined)
      updateData.armCircumferenceCm = dto.armCircumferenceCm;

    if (dto.measurementDate) {
      const birth = new Date(existing.child.birthDate);
      const measure = new Date(dto.measurementDate);
      const ageMonth =
        (measure.getFullYear() - birth.getFullYear()) * 12 +
        (measure.getMonth() - birth.getMonth());
      updateData.ageMonth = ageMonth < 0 ? 0 : ageMonth;
      updateData.measurementDate = measure;
    }

    try {
      const result = await this.prisma.anthropometry.update({
        where: { id: recordId },
        data: updateData,
      });

      this.logger.log(`[SUCCESS] Antropometri ID ${recordId} berhasil diupdate`);
      return result;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal update antropometri: ${error.message}`,
      );
      throw error;
    }
  }

  async recordMeasurement(
    userId: string,
    userName: string,
    roles: number[],
    dto: CreateAnthropometryDto,
  ) {
    this.logger.log(
      `[REQUEST] Mencatat pengukuran baru untuk Child ID: ${dto.childId} oleh ${userName}`,
    );

    // 1. Ambil data anak
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) {
      this.logger.warn(
        `[NOT FOUND] Gagal mencatat. Child ID ${dto.childId} tidak ditemukan`,
      );
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    // 2. Cek kepemilikan
    const isKader = roles.includes(2);
    const isMotherOwner = child.mother.userId === userId;

    if (!isKader && !isMotherOwner) {
      this.logger.error(
        `[FORBIDDEN] Akses ditolak. User ${userName} mencoba mengisi data anak orang lain!`,
      );
      throw new ForbiddenException(
        'Anda tidak diizinkan mencatat data untuk anak ini.',
      );
    }

    // 3. Hitung Selisih Bulan
    const birth = new Date(child.birthDate);
    const measure = new Date(dto.measurementDate);
    const ageMonth =
      (measure.getFullYear() - birth.getFullYear()) * 12 +
      (measure.getMonth() - birth.getMonth());

    const finalAge = ageMonth < 0 ? 0 : ageMonth;

    this.logger.log(
      `[CALCULATION] Anak: ${child.name}, Usia Terhitung: ${finalAge} bulan`,
    );

    // 4. Simpan Data
    try {
      const createData: Prisma.AnthropometryUncheckedCreateInput = {
        childId: dto.childId,
        weightKg: dto.weightKg,
        heightCm: dto.heightCm,
        headCircumferenceCm: dto.headCircumferenceCm ?? null,
        armCircumferenceCm: dto.armCircumferenceCm ?? null,
        ageMonth: finalAge,
        measuredBy: userName,
        measurementDate: measure,
        verified: isKader,
      };
      const result = await this.prisma.anthropometry.create({
        data: createData,
      });

      this.logger.log(
        `[SUCCESS] Data berhasil disimpan (ID: ${result.id}). Verified: ${isKader}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal simpan antropometri: ${error.message}`,
      );
      throw error;
    }
  }

  async getHistoryByChild(childId: string) {
    this.logger.log(
      `[FETCH] Mengambil riwayat antropometri untuk Child ID: ${childId}`,
    );
    return this.prisma.anthropometry.findMany({
      where: { childId },
      orderBy: { measurementDate: 'desc' },
    });
  }
}
