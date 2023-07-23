import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [AuthController],
  imports: [PrismaModule, PrismaModule],
  providers: [AuthService],
})
export class AppModule {}
