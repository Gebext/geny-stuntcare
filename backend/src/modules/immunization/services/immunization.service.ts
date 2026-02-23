import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger, // 1. Import Logger
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaservice';
import { CreateImmunizationDto } from '../dtos/crate-immunization.dto';
import { UpdateImmunizationDto } from '../dtos/update-immunization.dto';

@Injectable()
export class ImmunizationService {
  // 2. Inisialisasi Logger
  private readonly logger = new Logger(ImmunizationService.name);

  constructor(private prisma: PrismaService) {}

  async updateRecord(userId: string, recordId: string, dto: UpdateImmunizationDto) {
    this.logger.log(
      `[UPDATE] Request update imunisasi ID: ${recordId}`,
    );

    const existing = await this.prisma.immunization.findUnique({
      where: { id: recordId },
      include: { child: { include: { mother: true } } },
    });

    if (!existing) {
      this.logger.warn(`[NOT FOUND] Immunization ID ${recordId} tidak ditemukan`);
      throw new NotFoundException('Data imunisasi tidak ditemukan');
    }

    // Validasi akses
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    const isKader = user?.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = existing.child.mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(`[FORBIDDEN] User ${userId} tidak punya akses update imunisasi ini`);
      throw new ForbiddenException('Anda tidak memiliki akses untuk mengubah data ini.');
    }

    const updateData: any = {};
    if (dto.vaccineName !== undefined) updateData.vaccineName = dto.vaccineName;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.dateGiven) updateData.dateGiven = new Date(dto.dateGiven);

    try {
      const result = await this.prisma.immunization.update({
        where: { id: recordId },
        data: updateData,
      });
      this.logger.log(`[SUCCESS] Immunization ID ${recordId} berhasil diupdate`);
      return result;
    } catch (error) {
      this.logger.error(`[DB ERROR] Gagal update imunisasi: ${error.message}`);
      throw error;
    }
  }

  async addRecord(userId: string, dto: CreateImmunizationDto) {
    this.logger.log(
      `[CREATE] Mencatat data imunisasi '${dto.vaccineName}' untuk Child ID: ${dto.childId}`,
    );

    // 1. Cari data anak dan relasi ibunya
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

    // 2. Ambil data User dan Role
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      this.logger.error(`[AUTH ERROR] User ID ${userId} tidak ditemukan`);
      throw new NotFoundException('User tidak ditemukan');
    }

    // 3. Logic Validasi
    const isKader = user.roles.some((r: any) => r.role.name === 'KADER');
    const isOwner = child.mother.userId === userId;

    if (!isKader && !isOwner) {
      this.logger.error(
        `[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat imunisasi anak orang lain.`,
      );
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mencatat imunisasi anak ini.',
      );
    }

    // 4. Eksekusi simpan data
    try {
      const result = await this.prisma.immunization.create({
        data: {
          childId: dto.childId,
          vaccineName: dto.vaccineName,
          status: dto.status,
          dateGiven: new Date(dto.dateGiven),
        },
      });

      this.logger.log(
        `[SUCCESS] Vaksin '${dto.vaccineName}' status ${dto.status} berhasil disimpan untuk ${child.name}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[DB ERROR] Gagal menyimpan data imunisasi: ${error.message}`,
      );
      throw error;
    }
  }

  async getChildHistory(childId: string) {
    this.logger.log(`[FETCH] Mengambil riwayat imunisasi Child ID: ${childId}`);

    const data = await this.prisma.immunization.findMany({
      where: { childId },
      include: {
        child: { select: { name: true } },
      },
      orderBy: { dateGiven: 'desc' },
    });

    this.logger.log(
      `[FETCH SUCCESS] Berhasil menarik ${data.length} catatan imunisasi.`,
    );
    return data;
  }
}
