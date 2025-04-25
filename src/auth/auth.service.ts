import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException();
      }

      if (!payload.email) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findOneByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const accessToken = await this.jwtService.signAsync({
        sub: payload.sub,
        email: user.email,
      });

      return { accessToken, user };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
