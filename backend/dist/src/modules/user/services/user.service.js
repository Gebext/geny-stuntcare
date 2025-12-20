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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const class_transformer_1 = require("class-transformer");
const user_repository_1 = require("../repositories/user.repository");
const user_response_dto_1 = require("../dtos/user-response.dto");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const { password, ...userData } = createUserDto;
        const passwordHash = await bcrypt.hash(password, 10);
        const createdUser = await this.userRepository.create({
            ...userData,
            passwordHash
        });
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, createdUser);
    }
    async findAll(query) {
        const { page, limit, search, email } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (email) {
            where.email = email;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, totalCount] = await this.userRepository.findManyAndCount({
            skip,
            take: limit,
            where,
        });
        const lastPage = Math.ceil(totalCount / limit);
        return {
            users: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, users),
            meta: {
                total: totalCount,
                page: page,
                limit: limit,
                lastPage: lastPage,
            },
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async update(id, updateUserDto) {
        const existingUser = await this.userRepository.findOneById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        let updatedData = updateUserDto;
        if (updateUserDto.password) {
            const { password, ...restData } = updateUserDto;
            const passwordHash = await bcrypt.hash(password, 10);
            updatedData = { ...restData, passwordHash };
        }
        else {
            const { password, ...restData } = updateUserDto;
            updatedData = restData;
        }
        const updatedUser = await this.userRepository.update(id, updatedData);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
    async remove(id) {
        const existingUser = await this.userRepository.findOneById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        const removedUser = await this.userRepository.remove(id);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, removedUser);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map