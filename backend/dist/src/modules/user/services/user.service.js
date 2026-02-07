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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const class_transformer_1 = require("class-transformer");
const user_repository_1 = require("../repositories/user.repository");
const user_response_dto_1 = require("../dtos/user-response.dto");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async create(createUserDto) {
        this.logger.log(`Proses pembuatan user baru untuk email: ${createUserDto.email}`);
        try {
            const { password, ...userData } = createUserDto;
            if (userData.phone) {
                const existingPhone = await this.userRepository.findOneByPhone(userData.phone);
                if (existingPhone) {
                    throw new common_1.BadRequestException('Nomor HP sudah terdaftar');
                }
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const createdUser = await this.userRepository.create({
                ...userData,
                passwordHash,
            });
            this.logger.log(`User berhasil dibuat dengan ID: ${createdUser.id}`);
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, createdUser);
        }
        catch (error) {
            this.logger.error(`Gagal membuat user: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll(query) {
        this.logger.debug(`Fetching users dengan filter: ${JSON.stringify(query)}`);
        const { page, limit, search, email, role } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (email)
            where.email = email;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role && role !== 'ALL') {
            where.roles = {
                some: {
                    role: { name: role.toUpperCase() },
                },
            };
        }
        try {
            const [users, totalCount] = await this.userRepository.findManyAndCount({
                skip,
                take: limit,
                where,
            });
            this.logger.log(`Berhasil mengambil ${users.length} user (Total: ${totalCount})`);
            return {
                users: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, users),
                meta: {
                    total: totalCount,
                    page,
                    limit,
                    lastPage: Math.ceil(totalCount / limit),
                },
            };
        }
        catch (error) {
            this.logger.error(`Gagal mengambil daftar user: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        this.logger.debug(`Mencari user dengan ID: ${id}`);
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            this.logger.warn(`User dengan ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async findByRole(roleName) {
        this.logger.log(`Mencari users dengan role: ${roleName}`);
        const users = await this.userRepository.findMany({
            where: {
                roles: {
                    some: {
                        role: { name: roleName.toUpperCase() },
                    },
                },
            },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });
        this.logger.log(`Ditemukan ${users.length} user dengan role ${roleName}`);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, users);
    }
    async update(id, updateUserDto) {
        this.logger.log(`Proses update user ID: ${id}`);
        const existingUser = await this.userRepository.findOneById(id);
        if (!existingUser) {
            this.logger.warn(`Update gagal: User ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        const { password, ...restData } = updateUserDto;
        const finalData = { ...restData };
        if (password) {
            this.logger.debug(`Mengupdate password untuk user ID: ${id}`);
            finalData.passwordHash = await bcrypt.hash(password, 10);
        }
        delete finalData.password;
        try {
            const updatedUser = await this.userRepository.update(id, finalData);
            this.logger.log(`User ID: ${id} berhasil diperbarui`);
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
        }
        catch (error) {
            this.logger.error(`Gagal memperbarui user ID ${id}: ${error.message}`);
            throw error;
        }
    }
    async remove(id) {
        this.logger.log(`Mencoba menghapus user ID: ${id}`);
        const existingUser = await this.userRepository.findOneById(id);
        if (!existingUser) {
            this.logger.warn(`Hapus gagal: User ID ${id} tidak ditemukan`);
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        try {
            const removedUser = await this.userRepository.remove(id);
            this.logger.log(`User ID: ${id} berhasil dihapus dari database`);
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, removedUser);
        }
        catch (error) {
            this.logger.error(`Gagal menghapus user ID ${id}: ${error.message}`);
            throw error;
        }
    }
    async adminCreateUser(createUserDto) {
        const { email, role } = createUserDto;
        this.logger.log(`Admin membuat user baru: ${email} sebagai ${role || 'KADER'}`);
        try {
            const { password, role: roleInput, ...userData } = createUserDto;
            const passwordToHash = password || 'Password123!';
            const passwordHash = await bcrypt.hash(passwordToHash, 10);
            const createdUser = await this.userRepository.create({
                ...userData,
                passwordHash,
                role: roleInput ? roleInput.toUpperCase() : 'KADER',
            });
            this.logger.log(`User (Admin Created) berhasil dibuat dengan ID: ${createdUser.id}`);
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, createdUser);
        }
        catch (error) {
            this.logger.error(`Admin gagal membuat user: ${error.message}`);
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map