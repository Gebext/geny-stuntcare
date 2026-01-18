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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prismaservice_1 = require("../../../prisma/prismaservice");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getUserSelect() {
        return {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            roles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            motherProfile: true,
            chatSessions: true,
        };
    }
    async create(data) {
        const { role, passwordHash, name, email, phone } = data;
        const roleMapping = {
            ADMIN: 1,
            KADER: 2,
            MOTHER: 3,
        };
        const targetRoleId = role ? roleMapping[role.toUpperCase()] || 3 : 3;
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                phone,
                roles: {
                    create: [
                        {
                            role: {
                                connect: { id: targetRoleId },
                            },
                        },
                    ],
                },
            },
            select: this.getUserSelect(),
        });
        return user;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: this.getUserSelect(),
        });
    }
    async findOneById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: this.getUserSelect(),
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.email)
            updateData.email = data.email;
        if (data.phone)
            updateData.phone = data.phone;
        if (data.passwordHash)
            updateData.passwordHash = data.passwordHash;
        const user = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: this.getUserSelect(),
        });
        return user;
    }
    async remove(id) {
        return await this.prisma.$transaction(async (tx) => {
            await tx.userRole.deleteMany({ where: { userId: id } });
            await tx.motherProfile.deleteMany({ where: { userId: id } });
            const user = await tx.user.delete({
                where: { id },
                select: { id: true, name: true, email: true },
            });
            return user;
        });
    }
    async findManyAndCount(params) {
        const { skip, take, where, orderBy } = params;
        const [users, totalCount] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.getUserSelect(),
            }),
            this.prisma.user.count({ where }),
        ]);
        return [users, totalCount];
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map