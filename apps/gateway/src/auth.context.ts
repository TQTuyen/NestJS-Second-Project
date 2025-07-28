import { AuthServiceClient } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

export const createAuthContext = (authService: AuthServiceClient) => {
  return async ({ req }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const token = req?.headers?.authentication;
      if (!token) throw new UnauthorizedException('No token provided');

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
};
