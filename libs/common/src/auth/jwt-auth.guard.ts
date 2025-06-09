import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { tap, map, catchError } from 'rxjs/operators';
import { UserDto } from '../dto';

export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const jwt = request.cookies?.['Authentication'] as string;
    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          request.user = res;
        }),
        map(() => true),
        catchError(() => of(false)), // Handle errors gracefully
        // If the authentication fails, return false
        // If the authentication is successful, return true
      );
  }
}
