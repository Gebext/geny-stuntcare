import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../responses/api-response.interface';

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const httpStatus = context.switchToHttp().getResponse().statusCode;
    
    let defaultMessage: string;

    switch (request.method) {
      case 'POST':
        defaultMessage = httpStatus === HttpStatus.CREATED ? 'Resource created successfully.' : 'Request processed successfully.';
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

    return next.handle().pipe(
      map(data => ({
        success: true,
        message: defaultMessage, 
        data: data || {}, 
      })),
    );
  }
}