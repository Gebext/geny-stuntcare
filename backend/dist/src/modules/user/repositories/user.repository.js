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
    async create(data) {
        const DEFAULT_ROLE_ID = 3;
        const user = await this.prisma.user.create({
            data: {
                ...data,
                roles: {
                    create: [
                        {
                            role: {
                                connect: { id: DEFAULT_ROLE_ID }
                            }
                        }
                    ]
                }
            },
            select: {
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
                                name: true
                            }
                        }
                    }
                },
                motherProfile: true,
                chatSessions: true,
            },
        });
        return user;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                roles: true,
                motherProfile: true,
                chatSessions: true,
            },
        });
        return users;
    }
    async findOneById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                roles: true,
                motherProfile: true,
                chatSessions: true,
            },
        });
        return user;
    }
    async update(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                roles: true,
                motherProfile: true,
                chatSessions: true,
            },
        });
        return user;
    }
    async remove(id) {
        const user = await this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                roles: true,
                motherProfile: true,
                chatSessions: true,
            },
        });
        return user;
    }
    async findManyAndCount(params) {
        const { skip, take, where, orderBy } = params;
        const userSelect = {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            roles: true,
            motherProfile: true,
            chatSessions: true,
        };
        const [users, totalCount] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take,
                where,
                orderBy,
                select: userSelect,
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