import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    this.logger.log(`Req - ${req.url} - ${JSON.stringify(req.body)}`);
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap((data: any) =>
          this.logger.log(
            `Res - ${req.url} - ${JSON.stringify(data)} - ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
