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
var AnthropometryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropometryService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let AnthropometryService = AnthropometryService_1 = class AnthropometryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnthropometryService_1.name);
    }
    async recordMeasurement(userId, userName, roles, dto) {
        this.logger.log(`[REQUEST] Mencatat pengukuran baru untuk Child ID: ${dto.childId} oleh ${userName}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id: dto.childId },
            include: { mother: true },
        });
        if (!child) {
            this.logger.warn(`[NOT FOUND] Gagal mencatat. Child ID ${dto.childId} tidak ditemukan`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        }
        const isKader = roles.includes(2);
        const isMotherOwner = child.mother.userId === userId;
        if (!isKader && !isMotherOwner) {
            this.logger.error(`[FORBIDDEN] Akses ditolak. User ${userName} mencoba mengisi data anak orang lain!`);
            throw new common_1.ForbiddenException('Anda tidak diizinkan mencatat data untuk anak ini.');
        }
        const birth = new Date(child.birthDate);
        const measure = new Date(dto.measurementDate);
        const ageMonth = (measure.getFullYear() - birth.getFullYear()) * 12 +
            (measure.getMonth() - birth.getMonth());
        const finalAge = ageMonth < 0 ? 0 : ageMonth;
        this.logger.log(`[CALCULATION] Anak: ${child.name}, Usia Terhitung: ${finalAge} bulan`);
        try {
            const result = await this.prisma.anthropometry.create({
                data: {
                    childId: dto.childId,
                    weightKg: dto.weightKg,
                    heightCm: dto.heightCm,
                    ageMonth: finalAge,
                    measuredBy: userName,
                    measurementDate: measure,
                    verified: isKader,
                },
            });
            this.logger.log(`[SUCCESS] Data berhasil disimpan (ID: ${result.id}). Verified: ${isKader}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal simpan antropometri: ${error.message}`);
            throw error;
        }
    }
    async getHistoryByChild(childId) {
        this.logger.log(`[FETCH] Mengambil riwayat antropometri untuk Child ID: ${childId}`);
        return this.prisma.anthropometry.findMany({
            where: { childId },
            orderBy: { measurementDate: 'desc' },
        });
    }
};
exports.AnthropometryService = AnthropometryService;
exports.AnthropometryService = AnthropometryService = AnthropometryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], AnthropometryService);
//# sourceMappingURL=anthropometry.service.js.map