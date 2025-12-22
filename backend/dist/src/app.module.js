"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
const mother_module_1 = require("./modules/mother/mother.module");
const child_module_1 = require("./modules/child/child.module");
const anthropometry_module_1 = require("./modules/anthropometry/anthropometry.module");
const immunization_module_1 = require("./modules/immunization/immunization.module");
const nutrition_module_1 = require("./modules/nutrition/nutrition.module");
const health_module_1 = require("./modules/health/health.module");
const environment_module_1 = require("./modules/environment/environment.module");
const chat_module_1 = require("./modules/chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            mother_module_1.MotherModule,
            child_module_1.ChildModule,
            anthropometry_module_1.AnthropometryModule,
            immunization_module_1.ImmunizationModule,
            nutrition_module_1.NutritionModule,
            health_module_1.HealthModule,
            environment_module_1.EnvironmentModule,
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map