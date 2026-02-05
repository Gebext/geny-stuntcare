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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let EnvironmentService = class EnvironmentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertEnvironment(userId, roles, dto) {
        const mother = await this.prisma.motherProfile.findUnique({
            where: { id: dto.motherId },
        });
        if (!mother)
            throw new common_1.NotFoundException('Profil Ibu tidak ditemukan');
        const isKader = roles.includes(2);
        const isOwner = mother.userId === userId;
        if (!isKader && !isOwner) {
            throw new common_1.ForbiddenException('Anda tidak diizinkan mengubah data lingkungan ini.');
        }
        return this.prisma.environmentData.upsert({
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
    }
    async getByMother(motherId) {
        return this.prisma.environmentData.findUnique({
            where: { motherId },
        });
    }
};
exports.EnvironmentService = EnvironmentService;
exports.EnvironmentService = EnvironmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], EnvironmentService);
//# sourceMappingURL=environment.service.js.map