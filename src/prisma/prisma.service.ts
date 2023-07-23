import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const DATABASE_URL =
  'postgresql://postgres:123@localhost:5434/nest?schema=public';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }
}
