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
exports.MotherService = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let MotherService = class MotherService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } }
        });
        const isMother = user.roles.some(ur => ur.role.name === 'MOTHER');
        if (!isMother) {
            throw new common_1.ForbiddenException('Hanya akun Ibu yang dapat memiliki profil klinis Ibu');
        }
        return this.prisma.motherProfile.upsert({
            where: { userId },
            update: { ...dto },
            create: { userId, ...dto },
        });
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
};
exports.MotherService = MotherService;
exports.MotherService = MotherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], MotherService);
//# sourceMappingURL=mother.service.js.map