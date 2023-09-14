import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorsService } from '@modules/errors';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private readonly errorsService = new ErrorsService();

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ message: string }> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (req.cookies.jwt)
      throw new BadRequestException(this.errorsService.userIsLoggedIn);

    return next.handle().pipe(
      map((jwt: string) => {
        res.cookie('jwt', jwt, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        return { message: 'Logueado exitosamente!' };
      }),
    );
  }
}
