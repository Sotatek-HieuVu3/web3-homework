import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { code, message, ...rest }: any = exception.getResponse();
    this.logger.error(exception);
    this.logger.error(exception.stack);

    response.status(status).json({
      code: code || 'ERROR_00000',
      statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
      info: {
        message: message || 'Unknown errors',
        ...rest,
      },
      path: request.url,
    });
  }
}
