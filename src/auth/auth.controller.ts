import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: AuthDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK) // return 200.
  @Post('/login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
