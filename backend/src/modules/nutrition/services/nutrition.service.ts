import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger, // 1. Import Logger
} from '@nestjs/common';
import { CreateNutritionDto } from '../dtos/create-nutrition.dto';
import { UpdateNutritionDto } from '../dtos/update-nutrition.dto';
import { PrismaService } from 'src/prisma/prismaservice';

@Injectable()
export class NutritionService {
  // 2. Inisialisasi Logger
  private readonly logger = new Logger(NutritionService.name);

  constructor(private prisma: PrismaService) {}

  async updateRecord(userId: string, recordId: string, dto: UpdateNutritionDto) {
    this.logger.log(
      `[UPDATE] Request update nutrisi ID: ${recordId}`,
    );

    const existing = await this.prisma.nutritionHistory.findUnique({
      where: { id: recordId },
      include: { child: { include: { mother: true } } },
    });

    if (!existing) {
      this.logger.warn(`[NOT FOUND] NutritionHistory ID ${recordId} tidak ditemukan`);
      throw new NotFoundException('Data nutrisi tidak ditemukan');
    }

    // Validasi akses
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    const isKader = user?.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = existing.child.mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(`[FORBIDDEN] User ${userId} tidak punya akses update nutrisi ini`);
      throw new ForbiddenException('Anda tidak memiliki akses untuk mengubah data ini.');
    }

    const updateData: any = {};
    if (dto.foodType !== undefined) updateData.foodType = dto.foodType;
    if (dto.frequencyPerDay !== undefined) updateData.frequencyPerDay = dto.frequencyPerDay;
    if (dto.proteinSource !== undefined) updateData.proteinSource = dto.proteinSource;
    if (dto.recordedAt) updateData.recordedAt = new Date(dto.recordedAt);

    try {
      const result = await this.prisma.nutritionHistory.update({
        where: { id: recordId },
        data: updateData,
      });
      this.logger.log(`[SUCCESS] NutritionHistory ID ${recordId} berhasil diupdate`);
      return result;
    } catch (error) {
      this.logger.error(`[DB ERROR] Gagal update nutrisi: ${error.message}`);
      throw error;
    }
  }

  async addRecord(userId: string, dto: CreateNutritionDto) {
    this.logger.log(
      `[CREATE] Mencatat riwayat nutrisi untuk Child ID: ${dto.childId}`,
    );

    // 1. Validasi keberadaan Anak dan relasi Ibunya
    const child = await this.prisma.childProfile.findUnique({
      where: { id: dto.childId },
      include: { mother: true },
    });

    if (!child) {
      this.logger.warn(
        `[NOT FOUND] Gagal mencatat nutrisi. Child ID ${dto.childId} tidak ditemukan`,
      );
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    // 2. Ambil data User yang login beserta Role-nya
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      this.logger.error(`[AUTH ERROR] User ID ${userId} tidak ditemukan`);
      throw new NotFoundException('User tidak ditemukan');
    }

    // 3. Logic Proteksi: Kader (Global) atau Ibu (Pemilik Anak)
    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(
        `[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat nutrisi anak yang bukan haknya.`,
      );
      throw new ForbiddenException(
        'Akses ditolak untuk mencatat riwayat nutrisi anak ini.',
      );
    }

    // 4. Simpan Record Nutrisi
    try {
      const result = await this.prisma.nutritionHistory.create({
        data: {
          childId: dto.childId,
          foodType: dto.foodType,
          frequencyPerDay: dto.frequencyPerDay,
          proteinSource: dto.proteinSource,
          recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
        },
      });

      this.logger.log(
        `[SUCCESS] Data nutrisi tersimpan. Protein: ${dto.proteinSource}, Frekuensi: ${dto.frequencyPerDay}x`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal simpan data nutrisi: ${error.message}`,
      );
      throw error;
    }
  }

  async getHistory(childId: string) {
    this.logger.log(`[FETCH] Mengambil riwayat nutrisi Child ID: ${childId}`);

    const child = await this.prisma.childProfile.findUnique({
      where: { id: childId },
    });

    if (!child) {
      this.logger.warn(`[NOT FOUND] Child ID ${childId} tidak ditemukan`);
      throw new NotFoundException('Data anak tidak ditemukan');
    }

    const histories = await this.prisma.nutritionHistory.findMany({
      where: { childId },
      orderBy: { recordedAt: 'desc' },
    });

    this.logger.log(
      `[FETCH SUCCESS] Ditemukan ${histories.length} catatan asupan nutrisi.`,
    );
    return histories;
  }
}
