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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
let AdminDashboardController = class AdminDashboardController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAllChildren(page, limit, search, riskStatus) {
        const result = await this.adminService.getAllChildren({
            page,
            limit,
            search,
            riskStatus,
        });
        return {
            success: true,
            message: 'Berhasil mengambil data anak dengan filter',
            data: result.list,
            meta: result.meta,
        };
    }
    async getChildDetail(id) {
        const data = await this.adminService.getChildById(id);
        return {
            success: true,
            message: 'Detail anak berhasil ditarik',
            data,
        };
    }
    async getSummary() {
        const stats = await this.adminService.getMainStats();
        const performance = await this.adminService.getKaderPerformance();
        return {
            success: true,
            message: 'Data dashboard admin berhasil ditarik.',
            data: {
                ...stats,
                kaderPerformance: performance,
            },
        };
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('children'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('riskStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getAllChildren", null);
__decorate([
    (0, common_1.Get)('children/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getChildDetail", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getSummary", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('dashboard/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [admin_service_1.AdminDashboardService])
], AdminDashboardController);
//# sourceMappingURL=admin.controller.js.map