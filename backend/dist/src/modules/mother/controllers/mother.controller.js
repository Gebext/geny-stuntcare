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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotherController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const mother_service_1 = require("../services/mother.service");
const create_mother_profile_dto_1 = require("../dtos/create-mother-profile.dto");
const response_wrapper_interceptor_1 = require("../../../common/interceptors/response-wrapper.interceptor");
let MotherController = class MotherController {
    constructor(motherService) {
        this.motherService = motherService;
    }
    async handleProfile(req, dto) {
        const userId = req.user.id || req.user.sub;
        if (!userId)
            throw new common_1.ForbiddenException('User ID tidak ditemukan dalam token');
        return this.motherService.upsertProfile(userId, dto);
    }
    async updateProfile(req, dto) {
        const userId = req.user.id || req.user.sub;
        if (!userId)
            throw new common_1.ForbiddenException('User ID tidak ditemukan dalam token');
        return this.motherService.upsertProfile(userId, dto);
    }
    async getMyProfile(req) {
        const userId = req.user.id || req.user.sub;
        return this.motherService.getProfile(userId);
    }
    async getMotherProfile(userId) {
        return this.motherService.getProfile(userId);
    }
};
exports.MotherController = MotherController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, roles_decorators_1.Roles)('MOTHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mother_profile_dto_1.CreateMotherProfileDto]),
    __metadata("design:returntype", Promise)
], MotherController.prototype, "handleProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, roles_decorators_1.Roles)('MOTHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mother_profile_dto_1.CreateMotherProfileDto]),
    __metadata("design:returntype", Promise)
], MotherController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    (0, roles_decorators_1.Roles)('MOTHER', 'KADER', 'ADMIN'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MotherController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    (0, roles_decorators_1.Roles)('KADER', 'ADMIN'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MotherController.prototype, "getMotherProfile", null);
exports.MotherController = MotherController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor, response_wrapper_interceptor_1.ResponseWrapperInterceptor),
    (0, common_1.Controller)('mother'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [mother_service_1.MotherService])
], MotherController);
//# sourceMappingURL=mother.controller.js.map