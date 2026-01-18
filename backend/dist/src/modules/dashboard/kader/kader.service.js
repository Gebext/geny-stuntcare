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
    async getPriorityAgenda(kaderId, page = 1, limit = 10) {
        const assignments = await this.prisma.kaderAssignment.findMany({
            where: { kaderId },
            include: {
                mother: {
                    include: {
                        user: { select: { name: true, phone: true } },
                        childProfiles: {
                            include: {
                                aiAnalysis: true,
                                anthropometries: {
                                    orderBy: { measurementDate: 'desc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });
        let agenda = [];
        for (const assign of assignments) {
            for (const child of assign.mother.childProfiles) {
                let reason = '';
                let priorityScore = 0;
                const lastMeasure = child.anthropometries[0]?.measurementDate;
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                if (child.aiAnalysis && child.aiAnalysis.score < 60) {
                    reason = 'Skor kesehatan AI rendah. Perlu intervensi nutrisi.';
                    priorityScore = 3;
                }
                else if (!lastMeasure || lastMeasure < thirtyDaysAgo) {
                    reason = 'Jadwal timbang rutin bulan ini terlewat.';
                    priorityScore = 3;
                }
                else if (!child.isVerified) {
                    reason = 'Data terbaru belum diverifikasi oleh petugas.';
                    priorityScore = 2;
                }
                if (reason) {
                    agenda.push({
                        childId: child.id,
                        childName: child.name,
                        motherName: assign.mother.user?.name || 'Tanpa Nama',
                        motherPhone: assign.mother.user?.phone || '',
                        reason,
                        priority: priorityScore === 3
                            ? 'HIGH'
                            : priorityScore === 2
                                ? 'MEDIUM'
                                : 'LOW',
                        priorityScore,
                        status: 'PENGINGAT',
                    });
                }
            }
        }
        const total = agenda.length;
        const paginatedData = agenda
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .slice((page - 1) * limit, page * limit);
        return {
            data: paginatedData,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getPendingList(kaderId, page = 1, limit = 5) {
        const motherIds = await this.getMotherIds(kaderId);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [children, total] = await Promise.all([
            this.prisma.childProfile.findMany({
                where: {
                    motherId: { in: motherIds },
                    anthropometries: { none: { measurementDate: { gte: startOfMonth } } },
                },
                include: {
                    mother: {
                        include: { user: { select: { name: true, phone: true } } },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.childProfile.count({
                where: {
                    motherId: { in: motherIds },
                    anthropometries: { none: { measurementDate: { gte: startOfMonth } } },
                },
            }),
        ]);
        return {
            data: children.map((c) => ({
                id: c.id,
                name: c.name,
                motherName: c.mother.user.name,
                motherPhone: c.mother.user.phone,
                status: 'BELUM_DIUKUR',
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.KaderDashboardService = KaderDashboardService;
exports.KaderDashboardService = KaderDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], KaderDashboardService);
//# sourceMappingURL=kader.service.js.map