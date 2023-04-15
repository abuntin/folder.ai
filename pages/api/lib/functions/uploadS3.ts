import {
  PutObjectCommand, PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Directory } from 'lib/models';
import { s3, BUCKET_NAME } from '../models/s3';

export const uploadS3 = (
  file: { name: string; type: string; body: Buffer },
  directory: Directory
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {

      let { name, type, body } = file;

      let Key = `${directory.path}/${name}`;

      let Body = body;

      let ContentType = type;

      let Metadata = {};

      let params: PutObjectCommandInput = {
        Key,
        Body,
        ContentType,
        Metadata,
        Bucket: BUCKET_NAME
      }

      let command = new PutObjectCommand(params);

      let result = await s3.send(command);

      resolve(result.ETag)
      
    } catch (e) {
      reject(e.message);
    }
  });
