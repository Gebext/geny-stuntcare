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
exports.KaderDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let KaderDashboardService = class KaderDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMotherIds(kaderId) {
        const assignments = await this.prisma.kaderAssignment.findMany({
            where: { kaderId },
            select: { motherId: true },
        });
        return assignments.map((a) => a.motherId);
    }
    async getStats(kaderId) {
        const motherIds = await this.getMotherIds(kaderId);
        const [totalAnak, diukurCount, stuntingCount] = await Promise.all([
            this.prisma.childProfile.count({
                where: { motherId: { in: motherIds } },
            }),
            this.prisma.anthropometry.count({
                where: {
                    child: { motherId: { in: motherIds } },
                    measurementDate: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            this.prisma.aiAnalysis.count({
                where: { child: { motherId: { in: motherIds } }, score: { lt: 60 } },
            }),
        ]);
        return {
            totalAnak,
            pengukuranBulanIni: `${diukurCount}/${totalAnak}`,
            indikasiStunting: stuntingCount,
        };
    }
    async getPendingMeasurements(kaderId) {
        const motherIds = await this.getMotherIds(kaderId);
        return this.prisma.childProfile.findMany({
            where: {
                motherId: { in: motherIds },
                anthropometries: {
                    none: {
                        measurementDate: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        },
                    },
                },
            },
            include: {
                mother: { include: { user: { select: { name: true, phone: true } } } },
            },
        });
    }
    async getRecentActivities(kaderId) {
        const motherIds = await this.getMotherIds(kaderId);
        return this.prisma.anthropometry.findMany({
            where: { child: { motherId: { in: motherIds } } },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { child: { select: { name: true } } },
        });
    }
    async getRiskDistribution(kaderId) {
        const motherIds = await this.getMotherIds(kaderId);
        const stats = await this.prisma.aiAnalysis.groupBy({
            by: ['status'],
            where: { child: { motherId: { in: motherIds } } },
            _count: { id: true },
        });
        return stats.map((s) => ({ label: s.status, value: s._count.id }));
    }
};
exports.KaderDashboardService = KaderDashboardService;
exports.KaderDashboardService = KaderDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], KaderDashboardService);
//# sourceMappingURL=kader.service.js.map