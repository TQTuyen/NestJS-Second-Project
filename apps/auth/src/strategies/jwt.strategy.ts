import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { Logger } from 'nestjs-pino';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        (req: any) => req?.cookies?.['Authentication'] || req?.Authentication,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  validate({ userId }: ITokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
