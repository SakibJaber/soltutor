import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isArray } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';
    let validationErrors: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle validation errors from class-validator
      if (
        status === HttpStatus.BAD_REQUEST &&
        typeof exceptionResponse === 'object' &&
        'message' in (exceptionResponse as any) &&
        isArray((exceptionResponse as any).message)
      ) {
        const validationMessages = (exceptionResponse as any)
          .message as ValidationError[];
        validationErrors = this.formatValidationErrors(validationMessages);
        message = 'Validation failed';
        error = 'Bad Request';
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || error;
      } else {
        message = exceptionResponse;
      }
    } else if (this.isMongoError(exception)) {
      // Handle MongoDB duplicate key error (E11000)
      const mongoError = exception as any;
      if (mongoError.code === 11000) {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';

        // Extract field name from error message
        const field = this.extractDuplicateField(mongoError.message);
        message = field
          ? `A record with this ${field} already exists`
          : 'A record with this value already exists';
      } else {
        // Handle other MongoDB errors
        message = mongoError.message || 'Database error occurred';
        error = mongoError.name || 'DatabaseError';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Log error
    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Build response
    const responseBody: any = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add validation errors if they exist
    if (validationErrors) {
      responseBody.errors = validationErrors;
    }

    // Send response
    response.status(status).json(responseBody);
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): Array<{ field: string; errors: string[] }> {
    const result: Array<{ field: string; errors: string[] }> = [];

    for (const error of errors) {
      if (error.constraints) {
        result.push({
          field: error.property,
          errors: Object.values(error.constraints),
        });
      }

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        const children = this.formatValidationErrors(error.children);
        result.push(...children);
      }
    }

    return result;
  }

  private isMongoError(exception: unknown): boolean {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      'name' in exception &&
      (exception as any).name === 'MongoServerError'
    );
  }

  private extractDuplicateField(errorMessage: string): string | null {
    // MongoDB duplicate key error message format:
    // "E11000 duplicate key error collection: dbname.collection index: field_1 dup key: { field: "value" }"
    const match = errorMessage.match(/index: (\w+)_\d+/);
    if (match && match[1]) {
      return match[1];
    }

    // Alternative pattern: dup key: { field: "value" }
    const keyMatch = errorMessage.match(/dup key: \{ (\w+):/);
    if (keyMatch && keyMatch[1]) {
      return keyMatch[1];
    }

    return null;
  }
}
