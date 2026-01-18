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
exports.KaderDashboardController = void 0;
const common_1 = require("@nestjs/common");
const kader_service_1 = require("./kader.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let KaderDashboardController = class KaderDashboardController {
    constructor(kaderService) {
        this.kaderService = kaderService;
    }
    async getFullDashboard(req) {
        const userId = req.user.id;
        const [stats, pending, activities, distribution] = await Promise.all([
            this.kaderService.getStats(userId),
            this.kaderService.getPendingMeasurements(userId),
            this.kaderService.getRecentActivities(userId),
            this.kaderService.getRiskDistribution(userId),
        ]);
        return {
            stats,
            pendingMeasurements: pending,
            recentActivities: activities,
            riskDistribution: distribution,
        };
    }
    async getPending(req, page, limit) {
        const kaderId = req.user.id;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 5;
        const result = await this.kaderService.getPendingList(kaderId, pageNum, limitNum);
        return { success: true, ...result };
    }
    async getAgenda(req, page, limit) {
        const kaderId = req.user.id;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const result = await this.kaderService.getPriorityAgenda(kaderId, pageNumber, limitNumber);
        return {
            success: true,
            message: result.data.length > 0
                ? 'Daftar pengingat berhasil dimuat'
                : 'Tidak ada agenda prioritas',
            ...result,
        };
    }
};
exports.KaderDashboardController = KaderDashboardController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KaderDashboardController.prototype, "getFullDashboard", null);
__decorate([
    (0, common_1.Get)('pending-measurements'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], KaderDashboardController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('priority-agenda'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], KaderDashboardController.prototype, "getAgenda", null);
exports.KaderDashboardController = KaderDashboardController = __decorate([
    (0, common_1.Controller)('dashboard/kader'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [kader_service_1.KaderDashboardService])
], KaderDashboardController);
//# sourceMappingURL=kader.controller.js.map