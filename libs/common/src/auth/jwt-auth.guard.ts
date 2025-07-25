import {
  CanActivate,
  ExecutionContext,
  Inject,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { tap, map, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AUTH_SERVICE_NAME, AuthServiceClient, UserMessage } from '../types';

declare module 'express' {
  interface Request {
    user?: UserMessage; // Extend the Request interface to include user
  }
}

export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

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

    return this.authService
      .authenticate({
        Authentication: jwt,
      })
      .pipe(
        tap((res: UserMessage) => {
          if (
            roles &&
            !roles.some((role) => res.roles?.map((r) => r)?.includes(role))
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
        }),
      );
  }
}
