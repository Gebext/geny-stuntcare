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
exports.NutritionService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let NutritionService = class NutritionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addRecord(userId, roles, dto) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id: dto.childId },
            include: { mother: true },
        });
        if (!child)
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        const isKader = roles.includes(2);
        const isOwner = child.mother.userId === userId;
        if (!isKader && !isOwner) {
            throw new common_1.ForbiddenException('Akses ditolak untuk mencatat riwayat nutrisi ini.');
        }
        return this.prisma.nutritionHistory.create({
            data: {
                childId: dto.childId,
                foodType: dto.foodType,
                frequencyPerDay: dto.frequencyPerDay,
                proteinSource: dto.proteinSource,
                recordedAt: new Date(dto.recordedAt),
            },
        });
    }
    async getHistory(childId) {
        return this.prisma.nutritionHistory.findMany({
            where: { childId },
            orderBy: { recordedAt: 'desc' },
        });
    }
};
exports.NutritionService = NutritionService;
exports.NutritionService = NutritionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], NutritionService);
//# sourceMappingURL=nutrition.service.js.map