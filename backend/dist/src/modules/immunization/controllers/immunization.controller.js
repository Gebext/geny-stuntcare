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
exports.ImmunizationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const immunization_service_1 = require("../services/immunization.service");
const crate_immunization_dto_1 = require("../dtos/crate-immunization.dto");
let ImmunizationController = class ImmunizationController {
    constructor(service) {
        this.service = service;
    }
    async create(req, dto) {
        const roleIds = req.user.roles.map((r) => r.roleId || r.id);
        return this.service.addRecord(req.user.id, roleIds, dto);
    }
    async getHistory(childId) {
        return this.service.getChildHistory(childId);
    }
};
exports.ImmunizationController = ImmunizationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crate_immunization_dto_1.CreateImmunizationDto]),
    __metadata("design:returntype", Promise)
], ImmunizationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('child/:childId'),
    __param(0, (0, common_1.Param)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImmunizationController.prototype, "getHistory", null);
exports.ImmunizationController = ImmunizationController = __decorate([
    (0, common_1.Controller)('immunization'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [immunization_service_1.ImmunizationService])
], ImmunizationController);
//# sourceMappingURL=immunization.controller.js.map