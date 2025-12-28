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
exports.ChildService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let ChildService = class ChildService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id },
            include: {
                mother: {
                    include: {
                        user: {
                            select: { name: true, phone: true },
                        },
                        environment: true,
                    },
                },
                anthropometries: {
                    orderBy: { measurementDate: 'desc' },
                },
                immunizations: {
                    orderBy: { dateGiven: 'desc' },
                },
                nutritionHistories: {
                    orderBy: { recordedAt: 'desc' },
                },
                healthHistories: {
                    orderBy: { diagnosisDate: 'desc' },
                },
                aiResults: {
                    orderBy: { generatedAt: 'desc' },
                    take: 1,
                    include: { recommendations: true },
                },
            },
        });
        if (!child) {
            throw new common_1.NotFoundException(`Data anak dengan ID ${id} tidak ditemukan`);
        }
        return {
            ...child,
            motherName: child.mother?.user?.name || 'Tidak diketahui',
            contactMother: child.mother?.user?.phone || 'Tidak ada nomor',
            summary: {
                totalMeasurements: child.anthropometries.length,
                totalVaccines: child.immunizations.length,
                lastDiagnosis: child.healthHistories[0]?.diseaseName || 'Sehat/Tidak ada record',
                isVerified: child.isVerified,
            },
        };
    }
    async findAll(query) {
        const { name, gender, stuntingRisk, page, limit } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }
        if (gender) {
            where.gender = gender;
        }
        if (stuntingRisk) {
            where.stuntingRisk = stuntingRisk;
        }
        const [data, total] = await Promise.all([
            this.prisma.childProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mother: {
                        include: {
                            user: {
                                select: { name: true },
                            },
                            environment: true,
                        },
                    },
                    anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.childProfile.count({ where }),
        ]);
        const formattedData = data.map((item) => ({
            ...item,
            motherName: item.mother?.user?.name || 'Tidak diketahui',
        }));
        return {
            data: formattedData,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async createChild(userId, dto) {
        const motherProfile = await this.prisma.motherProfile.findUnique({
            where: { userId },
        });
        if (!motherProfile) {
            throw new common_1.NotFoundException('Lengkapi profil Ibu terlebih dahulu.');
        }
        const existing = await this.prisma.childProfile.findFirst({
            where: {
                motherId: motherProfile.id,
                name: { equals: dto.name, mode: 'insensitive' },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Anak dengan nama ${dto.name} sudah terdaftar.`);
        }
        return this.prisma.childProfile.create({
            data: {
                name: dto.name,
                gender: dto.gender,
                birthDate: new Date(dto.birthDate),
                birthWeight: dto.birthWeight,
                birthLength: dto.birthLength,
                asiExclusive: dto.asiExclusive,
                motherId: motherProfile.id,
            },
        });
    }
    async updateChild(userId, childId, dto) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childId },
            include: { mother: true },
        });
        if (!child || child.mother.userId !== userId) {
            throw new common_1.NotFoundException('Data anak tidak ditemukan.');
        }
        const { id, motherId, ...updateData } = dto;
        if (child.isVerified) {
            throw new common_1.ForbiddenException('Data sudah diverifikasi Kader dan tidak dapat diubah.');
        }
        return this.prisma.childProfile.update({
            where: { id: childId },
            data: {
                ...updateData,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : child.birthDate,
            },
        });
    }
    async verifyByKader(childId, risk) {
        const check = await this.prisma.childProfile.findUnique({
            where: { id: childId },
        });
        if (!check)
            throw new common_1.NotFoundException('Anak tidak ditemukan');
        return this.prisma.childProfile.update({
            where: { id: childId },
            data: {
                isVerified: true,
                stuntingRisk: risk,
            },
        });
    }
    async getMyChildren(userId) {
        return this.prisma.childProfile.findMany({
            where: { mother: { userId } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ChildService = ChildService;
exports.ChildService = ChildService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], ChildService);
//# sourceMappingURL=child-service.js.map