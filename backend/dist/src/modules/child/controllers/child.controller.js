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
exports.ChildController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const response_wrapper_interceptor_1 = require("../../../common/interceptors/response-wrapper.interceptor");
const create_child_dto_1 = require("../dtos/create-child.dto");
const child_service_1 = require("../services/child-service");
let ChildController = class ChildController {
    constructor(childService) {
        this.childService = childService;
    }
    async findAll(query) {
        return this.childService.findAll(query);
    }
    async create(req, dto) {
        const userId = req.user.id;
        return this.childService.createChild(userId, dto);
    }
    async getMyChildren(req) {
        return this.childService.getMyChildren(req.user.id);
    }
    async update(req, id, dto) {
        return this.childService.updateChild(req.user.id, id, dto);
    }
    async verify(id, risk) {
        return this.childService.verifyByKader(id, risk);
    }
    async getDetail(id) {
        return this.childService.findOne(id);
    }
};
exports.ChildController = ChildController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorators_1.Roles)('KADER', 'ADMIN'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_child_dto_1.ChildFilterDto]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorators_1.Roles)('MOTHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_child_dto_1.CreateChildDto]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorators_1.Roles)('MOTHER'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "getMyChildren", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorators_1.Roles)('MOTHER'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, roles_decorators_1.Roles)('KADER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('stuntingRisk')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorators_1.Roles)('KADER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChildController.prototype, "getDetail", null);
exports.ChildController = ChildController = __decorate([
    (0, common_1.UseInterceptors)(response_wrapper_interceptor_1.ResponseWrapperInterceptor),
    (0, common_1.Controller)('children'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [child_service_1.ChildService])
], ChildController);
//# sourceMappingURL=child.controller.js.map