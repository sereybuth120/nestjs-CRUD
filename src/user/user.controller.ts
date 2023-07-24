import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard) // make everything require a token
@Controller('user')
export class UserController {
  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
