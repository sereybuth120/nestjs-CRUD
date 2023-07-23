import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // generate password. hash
  async signUp(body: AuthDto) {
    const hash = await argon.hash(body.password);

    try {
      const user = await this.prisma.auth.create({
        data: {
          hash,
          email: body.email,
        },
      });

      delete user.hash; // don't show user hash in res

      return user;
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

  async login(body: AuthDto) {
    const user = await this.prisma.auth.findUnique({
      // find user by id
      where: {
        email: body.email,
      },
    });

    if (!user) throw new ForbiddenException('credentials incorrect');

    // check password user has the right password
    const isPassMatches = await argon.verify(user.hash, body.password);
    // wrong password
    if (!isPassMatches) throw new ForbiddenException('credentials incorrect');

    delete user.hash; // don't show user hash in res

    return { status: 'logged in', user };
  }
}
