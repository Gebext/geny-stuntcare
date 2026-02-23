"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NutritionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let NutritionService = NutritionService_1 = class NutritionService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(NutritionService_1.name);
    }
    async updateRecord(userId, recordId, dto) {
        this.logger.log(`[UPDATE] Request update nutrisi ID: ${recordId}`);
        const existing = await this.prisma.nutritionHistory.findUnique({
            where: { id: recordId },
            include: { child: { include: { mother: true } } },
        });
        if (!existing) {
            this.logger.warn(`[NOT FOUND] NutritionHistory ID ${recordId} tidak ditemukan`);
            throw new common_1.NotFoundException('Data nutrisi tidak ditemukan');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        const isKader = user?.roles.some((r) => r.role.name === 'KADER');
        const isOwner = existing.child.mother.userId === userId;
        if (!isKader && !isOwner) {
            this.logger.error(`[FORBIDDEN] User ${userId} tidak punya akses update nutrisi ini`);
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk mengubah data ini.');
        }
        const updateData = {};
        if (dto.foodType !== undefined)
            updateData.foodType = dto.foodType;
        if (dto.frequencyPerDay !== undefined)
            updateData.frequencyPerDay = dto.frequencyPerDay;
        if (dto.proteinSource !== undefined)
            updateData.proteinSource = dto.proteinSource;
        if (dto.recordedAt)
            updateData.recordedAt = new Date(dto.recordedAt);
        try {
            const result = await this.prisma.nutritionHistory.update({
                where: { id: recordId },
                data: updateData,
            });
            this.logger.log(`[SUCCESS] NutritionHistory ID ${recordId} berhasil diupdate`);
            return result;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal update nutrisi: ${error.message}`);
            throw error;
        }
    }
    async addRecord(userId, dto) {
        this.logger.log(`[CREATE] Mencatat riwayat nutrisi untuk Child ID: ${dto.childId}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id: dto.childId },
            include: { mother: true },
        });
        if (!child) {
            this.logger.warn(`[NOT FOUND] Gagal mencatat nutrisi. Child ID ${dto.childId} tidak ditemukan`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        if (!user) {
            this.logger.error(`[AUTH ERROR] User ID ${userId} tidak ditemukan`);
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const isKader = user.roles.some((r) => r.role.name === 'KADER');
        const isOwner = child.mother.userId === userId;
        if (!isKader && !isOwner) {
            this.logger.error(`[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat nutrisi anak yang bukan haknya.`);
            throw new common_1.ForbiddenException('Akses ditolak untuk mencatat riwayat nutrisi anak ini.');
        }
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
            this.logger.log(`[SUCCESS] Data nutrisi tersimpan. Protein: ${dto.proteinSource}, Frekuensi: ${dto.frequencyPerDay}x`);
            return result;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal simpan data nutrisi: ${error.message}`);
            throw error;
        }
    }
    async getHistory(childId) {
        this.logger.log(`[FETCH] Mengambil riwayat nutrisi Child ID: ${childId}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childId },
        });
        if (!child) {
            this.logger.warn(`[NOT FOUND] Child ID ${childId} tidak ditemukan`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        }
        const histories = await this.prisma.nutritionHistory.findMany({
            where: { childId },
            orderBy: { recordedAt: 'desc' },
        });
        this.logger.log(`[FETCH SUCCESS] Ditemukan ${histories.length} catatan asupan nutrisi.`);
        return histories;
    }
};
exports.NutritionService = NutritionService;
exports.NutritionService = NutritionService = NutritionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], NutritionService);
//# sourceMappingURL=nutrition.service.js.map