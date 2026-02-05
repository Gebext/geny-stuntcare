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
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let HealthService = HealthService_1 = class HealthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(HealthService_1.name);
    }
    async addRecord(userId, dto) {
        this.logger.log(`[CREATE] Mencatat riwayat kesehatan baru untuk Child ID: ${dto.childId}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id: dto.childId },
            include: { mother: true },
        });
        if (!child) {
            this.logger.warn(`[NOT FOUND] Gagal mencatat. Child ID ${dto.childId} tidak ditemukan`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        if (!user) {
            this.logger.error(`[AUTH ERROR] User ID ${userId} tidak ditemukan di database`);
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const isKader = user.roles.some((r) => r.role.name === 'KADER');
        const isOwner = child.mother.userId === userId;
        if (!isKader && !isOwner) {
            this.logger.error(`[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat kesehatan anak yang bukan haknya.`);
            throw new common_1.ForbiddenException('Akses ditolak untuk mencatat riwayat kesehatan anak ini.');
        }
        try {
            const record = await this.prisma.healthHistory.create({
                data: {
                    childId: dto.childId,
                    diseaseName: dto.diseaseName,
                    isChronic: dto.isChronic,
                    diagnosisDate: new Date(dto.diagnosisDate),
                },
            });
            this.logger.log(`[SUCCESS] Penyakit '${dto.diseaseName}' (Kronis: ${dto.isChronic}) berhasil dicatat untuk anak ${child.name}`);
            return record;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal menyimpan riwayat kesehatan: ${error.message}`);
            throw error;
        }
    }
    async getHistory(childId) {
        this.logger.log(`[FETCH] Mengambil riwayat kesehatan Child ID: ${childId}`);
        const childExists = await this.prisma.childProfile.findUnique({
            where: { id: childId },
        });
        if (!childExists) {
            this.logger.warn(`[NOT FOUND] Gagal ambil history. Child ID ${childId} tidak ada`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        }
        const histories = await this.prisma.healthHistory.findMany({
            where: { childId },
            orderBy: { diagnosisDate: 'desc' },
        });
        this.logger.log(`[FETCH SUCCESS] Ditemukan ${histories.length} catatan medis.`);
        return histories;
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map