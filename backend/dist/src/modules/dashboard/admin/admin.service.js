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
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let AdminDashboardService = class AdminDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMainStats() {
        const [counts, aiStats, recentUsers] = await Promise.all([
            this.prisma.$transaction([
                this.prisma.user.count(),
                this.prisma.childProfile.count(),
                this.prisma.motherProfile.count(),
                this.prisma.userRole.count({ where: { role: { name: 'KADER' } } }),
            ]),
            this.prisma.aiAnalysis.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { name: true, email: true, createdAt: true },
            }),
        ]);
        return {
            overview: {
                totalUsers: counts[0],
                totalAnak: counts[1],
                totalIbu: counts[2],
                totalKader: counts[3],
            },
            stuntingDistribution: aiStats.map((item) => ({
                status: item.status,
                count: item._count.id,
            })),
            recentRegistrations: recentUsers,
        };
    }
    async getKaderPerformance() {
        const performance = await this.prisma.user.findMany({
            where: {
                roles: { some: { role: { name: 'KADER' } } },
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: { kaderAssignments: true },
                },
            },
            orderBy: {
                kaderAssignments: { _count: 'desc' },
            },
            take: 10,
        });
        return performance.map((kader) => ({
            namaKader: kader.name,
            jumlahIbuDibina: kader._count.kaderAssignments,
        }));
    }
    async getAllChildren(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Number(query.limit) || 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                {
                    mother: {
                        user: { name: { contains: query.search, mode: 'insensitive' } },
                    },
                },
            ];
        }
        if (query.riskStatus) {
            where.aiAnalysis = {
                status: { contains: query.riskStatus, mode: 'insensitive' },
            };
        }
        if (query.gender) {
            where.gender = query.gender;
        }
        if (query.isVerified !== undefined && query.isVerified !== '') {
            where.isVerified = query.isVerified === 'true';
        }
        const [data, total] = await Promise.all([
            this.prisma.childProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mother: {
                        include: { user: { select: { name: true, phone: true } } },
                    },
                    aiAnalysis: true,
                    anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.childProfile.count({ where }),
        ]);
        return {
            list: data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getChildById(id) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id },
            include: {
                mother: { include: { user: true, environment: true } },
                anthropometries: { orderBy: { measurementDate: 'desc' } },
                immunizations: true,
                nutritionHistories: true,
                healthHistories: true,
                aiAnalysis: true,
            },
        });
        if (!child)
            throw new common_1.NotFoundException('Data anak tidak ditemukan');
        return child;
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], AdminDashboardService);
//# sourceMappingURL=admin.service.js.map