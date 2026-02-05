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
exports.NutritionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const nutrition_service_1 = require("../services/nutrition.service");
const create_nutrition_dto_1 = require("../dtos/create-nutrition.dto");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const response_wrapper_interceptor_1 = require("../../../common/interceptors/response-wrapper.interceptor");
let NutritionController = class NutritionController {
    constructor(service) {
        this.service = service;
    }
    async create(req, dto) {
        const userId = req.user.id || req.user.sub;
        return this.service.addRecord(userId, dto);
    }
    async getHistory(childId) {
        return this.service.getHistory(childId);
    }
};
exports.NutritionController = NutritionController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorators_1.Roles)('KADER', 'MOTHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_nutrition_dto_1.CreateNutritionDto]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('child/:childId'),
    (0, roles_decorators_1.Roles)('KADER', 'MOTHER', 'ADMIN'),
    __param(0, (0, common_1.Param)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NutritionController.prototype, "getHistory", null);
exports.NutritionController = NutritionController = __decorate([
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor, response_wrapper_interceptor_1.ResponseWrapperInterceptor),
    (0, common_1.Controller)('nutrition'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [nutrition_service_1.NutritionService])
], NutritionController);
//# sourceMappingURL=nutrition.controller.js.map