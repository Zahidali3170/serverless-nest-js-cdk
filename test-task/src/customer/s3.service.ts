import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION_AP,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_AP,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_AP,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command); // Works with AWS SDK v3
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION_AP}.amazonaws.com/uploads/${file.originalname}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('S3 upload failed');
    }
  }
}
