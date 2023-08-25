import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard) // make everything require a token
@Controller('user')
export class UserController {
  @Get('/me')
  getMe(@GetUser() user: any) {
    return user;
  }
}
