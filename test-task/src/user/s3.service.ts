import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID_AP'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY_AP'),
      region: this.configService.get('AWS_REGION_AP'),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    return this.s3.upload(params).promise();
  }
}
