import { CopyObjectCommandInput, CopyObjectCommand, CopyObjectCommandOutput } from "@aws-sdk/client-s3";
import { Folder, Directory } from "lib/models";
import { BUCKET_NAME, s3 } from "../models/s3";

export const copyS3 = (src: Folder, dest: Directory): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {

      let params: CopyObjectCommandInput = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${src.path}`,
        Key: dest.path
      }

      const command = new CopyObjectCommand(params);
      
      let result: CopyObjectCommandOutput = await s3.send(command);

      let { CopyObjectResult } = result;

      resolve(CopyObjectResult.ETag)

    } catch (e) {
      reject(e.message);
    }
})