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
var MotherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotherService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let MotherService = MotherService_1 = class MotherService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MotherService_1.name);
    }
    async upsertProfile(userId, dto) {
        this.logger.log(`[UPSERT PROFILE] Memproses profil untuk User ID: ${userId}`);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        const isMother = user.roles.some((ur) => ur.role.name === 'MOTHER');
        if (!isMother) {
            this.logger.warn(`[FORBIDDEN] User ${userId} bukan MOTHER tapi mencoba akses profil Ibu`);
            throw new common_1.ForbiddenException('Hanya akun Ibu yang dapat memiliki profil');
        }
        const result = await this.prisma.motherProfile.upsert({
            where: { userId },
            update: { ...dto },
            create: { userId, ...dto },
        });
        this.logger.log(`[SUCCESS] Profil Ibu ID ${result.id} berhasil diperbarui`);
        return result;
    }
    async getProfile(userId) {
        const profile = await this.prisma.motherProfile.findUnique({
            where: { userId },
            include: { environment: true, childProfiles: true },
        });
        if (!profile)
            throw new common_1.NotFoundException('Profil belum diisi');
        return profile;
    }
    async getAssignedMothers(kaderId) {
        this.logger.log(`[DASHBOARD KADER] Fetching hirarki data untuk Kader: ${kaderId}`);
        const assignments = await this.prisma.kaderAssignment.findMany({
            where: { kaderId },
            include: {
                mother: {
                    include: {
                        user: { select: { id: true, name: true, phone: true } },
                        childProfiles: {
                            include: {
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
        return assignments.map((asg) => {
            const mother = asg.mother;
            const children = mother.childProfiles.map((child) => {
                const lastAnthro = child.anthropometries?.[0];
                const needsCheck = lastAnthro
                    ? (Date.now() - new Date(lastAnthro.measurementDate).getTime()) /
                        (1000 * 60 * 60 * 24) >
                        30
                    : true;
                return {
                    childId: child.id,
                    childName: child.name,
                    needsCheck,
                    lastWeight: lastAnthro?.weightKg || 0,
                    lastHeight: lastAnthro?.heightCm || 0,
                };
            });
            return {
                motherId: mother.id,
                motherName: mother.user.name,
                phone: mother.user.phone,
                children,
            };
        });
    }
    async getAssignedChildren(kaderId, query) {
        const { name, gender, stuntingRisk, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        this.logger.log(`[KADER LIST] Fetching flat children list untuk Kader: ${kaderId}`);
        const where = {
            mother: {
                kaderAssignments: { some: { kaderId } },
            },
        };
        if (name)
            where.name = { contains: name, mode: 'insensitive' };
        if (gender)
            where.gender = gender;
        if (stuntingRisk)
            where.stuntingRisk = stuntingRisk;
        const [children, total] = await Promise.all([
            this.prisma.childProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mother: { include: { user: { select: { name: true } } } },
                    anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.childProfile.count({ where }),
        ]);
        return {
            data: children.map((child) => ({
                id: child.id,
                name: child.name,
                gender: child.gender,
                stuntingRisk: child.stuntingRisk,
                motherName: child.mother.user.name,
                isVerified: child.isVerified,
                lastMeasured: child.anthropometries?.[0]?.measurementDate || null,
            })),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async assignMotherToKader(kaderId, motherId) {
        this.logger.log(`[ADMIN] Assigning Mother ${motherId} to Kader ${kaderId}`);
        const kader = await this.prisma.user.findUnique({
            where: { id: kaderId },
            include: { roles: { include: { role: true } } },
        });
        if (!kader || !kader.roles.some((r) => r.role.name === 'KADER')) {
            throw new common_1.ForbiddenException('User yang dipilih bukan Kader atau tidak ditemukan');
        }
        const existing = await this.prisma.kaderAssignment.findFirst({
            where: { motherId },
        });
        if (existing) {
            this.logger.log(`[ADMIN] Updating existing assignment for Mother ${motherId}`);
            return this.prisma.kaderAssignment.update({
                where: { id: existing.id },
                data: { kaderId },
            });
        }
        return this.prisma.kaderAssignment.create({
            data: { kaderId, motherId },
        });
    }
    async getAllMothers(query) {
        const { page, limit, search, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        this.logger.log(`[ADMIN] Fetching all mothers search: ${search || 'none'}`);
        if (search) {
            where.user = { name: { contains: search, mode: 'insensitive' } };
        }
        if (status === 'ASSIGNED')
            where.kaderAssignments = { some: {} };
        if (status === 'UNASSIGNED')
            where.kaderAssignments = { none: {} };
        const [data, total] = await Promise.all([
            this.prisma.motherProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, phone: true } },
                    kaderAssignments: { include: { kader: { select: { name: true } } } },
                    _count: { select: { childProfiles: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.motherProfile.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPage: Math.ceil(total / limit) },
        };
    }
    async unassignMotherFromKader(motherId) {
        this.logger.warn(`[ADMIN] Unassigning Kader from Mother ID: ${motherId}`);
        const assignment = await this.prisma.kaderAssignment.findFirst({
            where: { motherId },
        });
        if (!assignment)
            throw new common_1.NotFoundException('Data penugasan tidak ditemukan');
        return this.prisma.kaderAssignment.delete({
            where: { id: assignment.id },
        });
    }
};
exports.MotherService = MotherService;
exports.MotherService = MotherService = MotherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], MotherService);
//# sourceMappingURL=mother.service.js.map