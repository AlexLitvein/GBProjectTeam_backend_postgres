import { Delete, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '@App/prisma/prisma.service';
import { AuthDto } from '@App/auth/dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(data: AuthDto) {
    const hash = await argon.hash(data.passcode);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          hash,
        },
        // INFO: select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Дубликаты запрещены');
        }
      }
      throw error;
    }
  }

  async signin(data: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Неверные входные данные');
    }
    const passMatch = await argon.verify(user.hash, data.passcode);
    if (!passMatch) {
      throw new ForbiddenException('Неверный пароль');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '9999m',
      secret: secret,
    });

    return { access_token: token };
  }
}
