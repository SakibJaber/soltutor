import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationMeta } from 'src/common/interfaces/pagination-response.interface';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // Check if this is a paginated response with 'meta'
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            statusCode: response.statusCode,
            message: data.message || 'Request successful',
            data: data.data,
            meta: {
              total: data.meta.total,
              page: data.meta.page,
              limit: data.meta.limit,
              totalPages: data.meta.lastPage || data.meta.totalPages,
            },
            timestamp: new Date().toISOString(),
          };
        }

        // Check if this is a paginated response with flat structure (legacy support if needed, or for UsersService before refactor)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'total' in data &&
          'page' in data &&
          'limit' in data
        ) {
          const totalPages = Math.ceil(data.total / data.limit);
          return {
            success: true,
            statusCode: response.statusCode,
            message: data.message || 'Request successful',
            data: data.data,
            meta: {
              total: data.total,
              page: data.page,
              limit: data.limit,
              totalPages,
            },
            timestamp: new Date().toISOString(),
          };
        }

        // Non-paginated response
        return {
          success: true,
          statusCode: response.statusCode,
          message: data?.message || 'Request successful',
          data: data?.data !== undefined ? data.data : data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
