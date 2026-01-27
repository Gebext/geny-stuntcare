import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../responses/api-response.interface';

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * BYPASS UNTUK PROMETHEUS
     * Jika request mengarah ke endpoint /metrics, kita langsung kembalikan datanya.
     * Prometheus membutuhkan format 'Plain Text', bukan 'JSON'.
     */
    if (request.url.includes('/metrics')) {
      return next.handle();
    }

    const httpStatus = context.switchToHttp().getResponse().statusCode;
    let defaultMessage: string;

    // Logika penentuan pesan berdasarkan Method HTTP
    switch (request.method) {
      case 'POST':
        defaultMessage =
          httpStatus === HttpStatus.CREATED
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

    /**
     * PEMBUNGKUS RESPON STANDAR
     * Semua endpoint selain /metrics akan dibungkus ke format JSON ini.
     */
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: defaultMessage,
        data: data || {},
      })),
    );
  }
}
