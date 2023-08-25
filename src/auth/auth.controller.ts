import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Get,
  Param,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthSignUpDto } from './dto';
import { JwtGuard } from './guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: AuthSignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK) // return 200.j
  @Post('/login')
  login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.authService.getUserById(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateUser(@Param('id') id: number, @Body() data: Partial<AuthSignUpDto>) {
    return this.authService.editUserById(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.authService.deleteUserById(id);
  }
}
