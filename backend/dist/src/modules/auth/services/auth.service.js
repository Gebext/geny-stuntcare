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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prismaservice_1 = require("../../../prisma/prismaservice");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(email, pass) {
        this.logger.log(`Menerima percobaan login untuk email: ${email}`);
        if (!pass) {
            this.logger.warn(`Login gagal: Password tidak disertakan untuk email ${email}`);
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: {
                    roles: {
                        include: { role: true },
                    },
                },
            });
            if (!user) {
                this.logger.warn(`Login gagal: User dengan email ${email} tidak ditemukan`);
                throw new common_1.UnauthorizedException('Email atau password salah');
            }
            if (!user.passwordHash) {
                this.logger.warn(`Login gagal: User ${email} mencoba login via password tapi akun menggunakan Social Login`);
                throw new common_1.UnauthorizedException('Metode login tidak sesuai');
            }
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            if (!isMatch) {
                this.logger.warn(`Login gagal: Password salah untuk email ${email}`);
                throw new common_1.UnauthorizedException('Email atau password salah');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                roles: user.roles.map((ur) => ur.role.name),
            };
            this.logger.log(`Login berhasil: User ID ${user.id} (${user.email}) telah diautentikasi`);
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        catch (error) {
            this.logger.error(`Error pada proses login untuk ${email}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prismaservice_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map