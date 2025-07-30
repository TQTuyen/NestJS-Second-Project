import { UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { app } from './app';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';

export const authContext = async ({ req }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = req?.headers?.authentication;
    if (!token) throw new UnauthorizedException('No token provided');

    console.log('token', token);

    const client = app.get<ClientGrpc>(AUTH_SERVICE_NAME);
    const authService = client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);

    const user = await lastValueFrom(
      authService.authenticate({
        Authentication: token as string,
      }),
    );

    return { user };
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};
