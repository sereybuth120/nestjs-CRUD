import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketItem, Client } from 'minio';

@Injectable()
export class MinioClientService {
  private readonly client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minio_access',
      secretKey: 'minio_secret',
    });
  }

  getClient(): Client {
    return this.client;
  }

  async fetchFiles(bucketName: string): Promise<string[]> {
    const files: BucketItem[] = [];
    const stream = this.client.listObjectsV2(bucketName);

    try {
      return new Promise<any[]>((resolve, reject) => {
        stream.on('data', (item: BucketItem) => {
          files.push(item);
        });

        stream.on('end', () => {
          resolve(files);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.log(`Error fetching bucket '${bucketName}`, error);
    }
  }

  async fetchFile(bucketName: string, fileName: string): Promise<Buffer> {
    try {
      const steam = await this.client.getObject(bucketName, fileName);
      return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        steam.on('data', (chunk: Buffer) => chunks.push(chunk));

        steam.on('end', () => {
          const fileData = Buffer.concat(chunks);
          resolve(fileData);
        });

        steam.on('error', (error: Error) => reject(error));
      });
    } catch (error) {
      console.error(
        `Error fetching file '${fileName}' from bucket '${bucketName}':`,
        error,
      );
    }
  }

  async uploadFile(bucketName: string, file: any): Promise<void> {
    const fileName = file?.originalname;
    const filePath = `C:\\Users\\hout.sereybuth\\Desktop\\Mock_Files\\${fileName}`;

    try {
      await this.client.fPutObject(bucketName, fileName, filePath);
      console.log(
        `File '${fileName}' uploaded to bucket '${bucketName}' successfully.`,
      );
    } catch (error) {
      console.error(
        `Error uploading file '${fileName}' to bucket '${bucketName}':`,
        error,
      );
      throw error;
    }
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.client.removeObject(bucketName, fileName);
    } catch (error) {
      console.error(
        `Error deleting file '${fileName}' from bucket '${bucketName}':`,
        error,
      );
    }
  }
}
