import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioController } from './minio.controller';

@Module({
  providers: [MinioClientService],
  controllers: [MinioController],
  exports: [MinioClientService],
})
export class MinioModule {}
