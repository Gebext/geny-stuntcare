"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseWrapperInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ResponseWrapperInterceptor = class ResponseWrapperInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.url.includes('/metrics')) {
            return next.handle();
        }
        const httpStatus = context.switchToHttp().getResponse().statusCode;
        let defaultMessage;
        switch (request.method) {
            case 'POST':
                defaultMessage =
                    httpStatus === common_1.HttpStatus.CREATED
                        ? 'Resource created successfully.'
                        : 'Request processed successfully.';
                break;
            case 'PATCH':
                defaultMessage = 'Resource updated successfully.';
                break;
            case 'DELETE':
                defaultMessage = 'Resource deleted successfully.';
                break;
            case 'GET':
            default:
                defaultMessage = 'Data retrieved successfully.';
                break;
        }
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            message: defaultMessage,
            data: data || {},
        })));
    }
};
exports.ResponseWrapperInterceptor = ResponseWrapperInterceptor;
exports.ResponseWrapperInterceptor = ResponseWrapperInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseWrapperInterceptor);
//# sourceMappingURL=response-wrapper.interceptor.js.map