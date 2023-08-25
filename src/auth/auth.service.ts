import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto, AuthSignUpDto } from './dto';

import { ConfigService } from '@nestjs/config';

// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // generate password. hash
  async signUp(body: AuthSignUpDto) {
    const hash = await argon.hash(body.password);
    const { email, firstName, lastName, age, accountNumber } = body;
    try {
      const user = await this.prisma.auth.create({
        data: {
          hash,
          email,
          firstName,
          lastName,
          age,
        },
      });

      delete user.hash; // don't show user hash in res

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // prisma duplicate field code
        // error: create new record with unique field
        if (error.code === 'P2002') {
          const errorField = error.meta.target[0];

          throw new ForbiddenException(
            `${errorField} credentials already taken`,
          );
        }
      }
    }
  }

  async login(body: AuthLoginDto) {
    const $user = await this.prisma.auth.findUnique({
      // find $user by id
      where: {
        email: body.email,
      },
    });

    if (!$user) throw new ForbiddenException('credentials incorrect');

    // check password $user has the right password
    const isPassMatches = await argon.verify($user.hash, body.password);
    // // wrong password
    if (!isPassMatches) throw new ForbiddenException('credentials incorrect');

    delete $user.hash; // don't show $user hash in res

    return this.signToken($user.id, $user.email);
  }

  async getUserById(id: number) {
    const user = await this.prisma.auth.findUnique({
      where: {
        id: +id,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return user;
  }

  async editUserById(id: number, data: Partial<AuthSignUpDto>) {
    const user = await this.prisma.auth.update({
      where: {
        id: +id,
      },
      data,
    });
    console.log(data);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return user;
  }

  async deleteUserById(id: number): Promise<void> {
    const user = await this.prisma.auth.delete({
      where: {
        id: +id,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    return {
      access_token: token,
    };
  }
}
