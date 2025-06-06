import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, res: Response) {
    const tokenPayload: ITokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.get<string>('JWT_EXPIRATION')!, 10),
    );

    const token = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: `${this.configService.get<string>('JWT_EXPIRATION')}s`,
    });

    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
