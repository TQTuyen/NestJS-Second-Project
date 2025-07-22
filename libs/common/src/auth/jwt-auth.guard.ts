import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { tap, map, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { User } from '../models';

declare module 'express' {
  interface Request {
    user?: User; // Extend the Request interface to include user
  }
}

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const jwt =
      (request.cookies?.['Authentication'] as string) ||
      (request.headers?.['authentication'] as string);
    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res: User) => {
          if (
            roles &&
            !roles.some((role) => res.roles?.map((r) => r.name)?.includes(role))
          ) {
            this.logger.error('The user have not valid roles');
            throw new UnauthorizedException();
          }

          request.user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }), // Handle errors gracefully
        // If the authentication fails, return false
        // If the authentication is successful, return true
      );
  }
}
