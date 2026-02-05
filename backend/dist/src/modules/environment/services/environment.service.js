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
var EnvironmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let EnvironmentService = EnvironmentService_1 = class EnvironmentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EnvironmentService_1.name);
    }
    async upsertEnvironment(userId, roles, dto) {
        this.logger.log(`[UPSERT] Request update data lingkungan untuk Mother ID: ${dto.motherId}`);
        const mother = await this.prisma.motherProfile.findUnique({
            where: { id: dto.motherId },
        });
        if (!mother) {
            this.logger.warn(`[NOT FOUND] Gagal update. Mother ID ${dto.motherId} tidak ditemukan`);
            throw new common_1.NotFoundException('Profil Ibu tidak ditemukan');
        }
        const isKader = roles.includes(2);
        const isOwner = mother.userId === userId;
        if (!isKader && !isOwner) {
            this.logger.error(`[FORBIDDEN] User ID ${userId} mencoba mengakses data lingkungan milik Ibu ID ${dto.motherId} tanpa izin!`);
            throw new common_1.ForbiddenException('Anda tidak diizinkan mengubah data lingkungan ini.');
        }
        try {
            const result = await this.prisma.environmentData.upsert({
                where: { motherId: dto.motherId },
                update: {
                    cleanWater: dto.cleanWater,
                    sanitation: dto.sanitation,
                    distanceFaskesKm: dto.distanceFaskesKm,
                    transportation: dto.transportation,
                },
                create: {
                    motherId: dto.motherId,
                    cleanWater: dto.cleanWater,
                    sanitation: dto.sanitation,
                    distanceFaskesKm: dto.distanceFaskesKm,
                    transportation: dto.transportation,
                },
            });
            this.logger.log(`[SUCCESS] Data lingkungan berhasil disimpan untuk Mother ID: ${dto.motherId}. Air Bersih: ${dto.cleanWater}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[DB ERROR] Gagal melakukan upsert data lingkungan: ${error.message}`);
            throw error;
        }
    }
    async getByMother(motherId) {
        this.logger.log(`[FETCH] Mengambil data lingkungan untuk Mother ID: ${motherId}`);
        const data = await this.prisma.environmentData.findUnique({
            where: { motherId },
        });
        if (!data) {
            this.logger.warn(`[NOT FOUND] Data lingkungan untuk Mother ID ${motherId} belum diisi.`);
        }
        return data;
    }
};
exports.EnvironmentService = EnvironmentService;
exports.EnvironmentService = EnvironmentService = EnvironmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], EnvironmentService);
//# sourceMappingURL=environment.service.js.map