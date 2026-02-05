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
var ImmunizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmunizationService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let ImmunizationService = ImmunizationService_1 = class ImmunizationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ImmunizationService_1.name);
    }
    async addRecord(userId, dto) {
        this.logger.log(`[CREATE] Mencatat data imunisasi '${dto.vaccineName}' untuk Child ID: ${dto.childId}`);
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
            this.logger.error(`[AUTH ERROR] User ID ${userId} tidak ditemukan`);
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const isKader = user.roles.some((r) => r.role.name === 'KADER');
        const isOwner = child.mother.userId === userId;
        if (!isKader && !isOwner) {
            this.logger.error(`[FORBIDDEN] Akses ditolak! User ${user.name} mencoba mencatat imunisasi anak orang lain.`);
            throw new common_1.ForbiddenException('Anda tidak memiliki akses untuk mencatat imunisasi anak ini.');
        }
        try {
            const result = await this.prisma.immunization.create({
                data: {
                    childId: dto.childId,
                    vaccineName: dto.vaccineName,
                    status: dto.status,
                    dateGiven: new Date(dto.dateGiven),
                },
            });
            this.logger.log(`[SUCCESS] Vaksin '${dto.vaccineName}' status ${dto.status} berhasil disimpan untuk ${child.name}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal menyimpan data imunisasi: ${error.message}`);
            throw error;
        }
    }
    async getChildHistory(childId) {
        this.logger.log(`[FETCH] Mengambil riwayat imunisasi Child ID: ${childId}`);
        const data = await this.prisma.immunization.findMany({
            where: { childId },
            include: {
                child: { select: { name: true } },
            },
            orderBy: { dateGiven: 'desc' },
        });
        this.logger.log(`[FETCH SUCCESS] Berhasil menarik ${data.length} catatan imunisasi.`);
        return data;
    }
};
exports.ImmunizationService = ImmunizationService;
exports.ImmunizationService = ImmunizationService = ImmunizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], ImmunizationService);
//# sourceMappingURL=immunization.service.js.map