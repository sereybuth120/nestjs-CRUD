import { MinioClientService } from './minio-client.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('/file')
export class MinioController {
  constructor(
    private minioClientService: MinioClientService,
    private prismaService: PrismaService,
  ) {}

  // @Get('/my-file')
  // async getFile() {
  //   const minioClient = this.minioClientService.getClient();
  //   const buckets = await minioClient.listBuckets();
  //   const users = await this.prismaService.auth.findMany();
  //   return `Hello, MinIO! Buckets: ${buckets.length}, Users: ${users.length}`;
  // }

  // @Get('/buckets')
  // getBucket() {
  //   const minioClient = this.minioClientService.getClient();
  //   const buckets = minioClient.listBuckets();

  //   return buckets;
  // }

  @Get('/bucket-name=:bucketName')
  async getAllFiles(@Param('bucketName') bucketName: string) {
    try {
      return await this.minioClientService.fetchFiles(bucketName);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/bucket-name=:bucketName/file-name=:fileName')
  async fetchFile(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const fileData = await this.minioClientService.fetchFile(
        bucketName,
        fileName,
      );
      res.send(fileData);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  }

  @Post('/bucket-name=:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: any,
  ): Promise<string> {
    try {
      await this.minioClientService.uploadFile(bucketName, file);
      return 'File uploaded successfully.';
    } catch (error) {
      return 'Error uploading file: ' + error.message;
    }
  }

  @Delete('/bucket-name=:bucketName/file-name=:fileName')
  async deleteFile(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
  ): Promise<void> {
    try {
      await this.minioClientService.deleteFile(bucketName, fileName);
    } catch (error) {
      console.error(`Error deleting file '${fileName}':`, error);
    }
  }
}
