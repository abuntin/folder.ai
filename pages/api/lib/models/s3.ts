import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_ACCESS_KEY_SECRET,
  }
});

export const BUCKET_NAME = process.env.AMAZON_DEFAULT_BUCKET;
