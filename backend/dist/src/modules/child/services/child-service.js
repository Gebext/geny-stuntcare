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
var ChildService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let ChildService = ChildService_1 = class ChildService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChildService_1.name);
    }
    async findOne(id) {
        this.logger.log(`[FETCH] Mengambil detail lengkap profil anak ID: ${id}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id },
            include: {
                mother: {
                    include: {
                        user: { select: { name: true, phone: true } },
                        environment: true,
                    },
                },
                anthropometries: { orderBy: { measurementDate: 'desc' } },
                immunizations: { orderBy: { dateGiven: 'desc' } },
                nutritionHistories: { orderBy: { recordedAt: 'desc' } },
                healthHistories: { orderBy: { diagnosisDate: 'desc' } },
                aiResults: {
                    orderBy: { generatedAt: 'desc' },
                    take: 1,
                    include: { recommendations: true },
                },
            },
        });
        if (!child) {
            this.logger.warn(`[NOT FOUND] Child ID ${id} tidak ada di database`);
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
        this.logger.log(`[QUERY] Pencarian anak - Name: ${query.name || 'ALL'}, Risk: ${query.stuntingRisk || 'ALL'}`);
        const { name, gender, stuntingRisk, page, limit } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (name)
            where.name = { contains: name, mode: 'insensitive' };
        if (gender)
            where.gender = gender;
        if (stuntingRisk)
            where.stuntingRisk = stuntingRisk;
        const [data, total] = await Promise.all([
            this.prisma.childProfile.findMany({
                where,
                skip,
                take: limit,
                include: {
                    mother: {
                        include: { user: { select: { name: true } }, environment: true },
                    },
                    anthropometries: { orderBy: { measurementDate: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.childProfile.count({ where }),
        ]);
        return {
            data: data.map((item) => ({
                ...item,
                motherName: item.mother?.user?.name || 'Tidak diketahui',
            })),
            meta: { total, page, lastPage: Math.ceil(total / limit) },
        };
    }
    async createChild(userId, dto) {
        this.logger.log(`[CREATE] User ${userId} mencoba mendaftarkan anak: ${dto.name}`);
        const motherProfile = await this.prisma.motherProfile.findUnique({
            where: { userId },
        });
        if (!motherProfile) {
            this.logger.warn(`[FAILED] User ${userId} belum melengkapi profil Ibu`);
            throw new common_1.NotFoundException('Lengkapi profil Ibu terlebih dahulu.');
        }
        const existing = await this.prisma.childProfile.findFirst({
            where: {
                motherId: motherProfile.id,
                name: { equals: dto.name, mode: 'insensitive' },
            },
        });
        if (existing) {
            this.logger.error(`[CONFLICT] Nama anak ${dto.name} sudah ada untuk Ibu ID ${motherProfile.id}`);
            throw new common_1.ConflictException(`Anak dengan nama ${dto.name} sudah terdaftar.`);
        }
        const newChild = await this.prisma.childProfile.create({
            data: {
                ...dto,
                birthDate: new Date(dto.birthDate),
                motherId: motherProfile.id,
            },
        });
        this.logger.log(`[SUCCESS] Anak berhasil dibuat ID: ${newChild.id}`);
        return newChild;
    }
    async updateChild(userId, childId, dto) {
        this.logger.log(`[UPDATE] Request update Child ID ${childId} oleh User ${userId}`);
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childId },
            include: { mother: true },
        });
        if (!child || child.mother.userId !== userId) {
            this.logger.error(`[UNAUTHORIZED] User ${userId} mencoba update data yang bukan miliknya!`);
            throw new common_1.NotFoundException('Data anak tidak ditemukan.');
        }
        if (child.isVerified) {
            this.logger.warn(`[FORBIDDEN] Mencoba update data yang sudah terverifikasi Kader (Child ID: ${childId})`);
            throw new common_1.ForbiddenException('Data sudah diverifikasi Kader dan tidak dapat diubah.');
        }
        return this.prisma.childProfile.update({
            where: { id: childId },
            data: {
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : child.birthDate,
            },
        });
    }
    async verifyByKader(childId, risk) {
        this.logger.log(`[VERIFICATION] Kader memverifikasi Child ID: ${childId} dengan risiko: ${risk}`);
        const check = await this.prisma.childProfile.findUnique({
            where: { id: childId },
        });
        if (!check)
            throw new common_1.NotFoundException('Anak tidak ditemukan');
        const updated = await this.prisma.childProfile.update({
            where: { id: childId },
            data: { isVerified: true, stuntingRisk: risk },
        });
        this.logger.log(`[SUCCESS] Child ID ${childId} resmi diverifikasi Kader.`);
        return updated;
    }
    async getMyChildren(userId) {
        this.logger.log(`[FETCH] Mengambil daftar anak milik Ibu (User ID: ${userId})`);
        return this.prisma.childProfile.findMany({
            where: { mother: { userId } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ChildService = ChildService;
exports.ChildService = ChildService = ChildService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], ChildService);
//# sourceMappingURL=child-service.js.map