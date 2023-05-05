// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// // The ID of your GCS bucket
// // const bucketName = 'your-unique-bucket-name';

// // The full path of your file inside the GCS bucket, e.g. 'yourFile.jpg' or 'folder1/folder2/yourFile.jpg'
// // const name = 'your-file-name';

// // Imports the Google Cloud client library
import { GetSignedUrlConfig } from '@google-cloud/storage';
import { Directory } from 'lib/models';
import { StorageClient } from '../models/firebase';
import { ValidFileTypes, STORAGE_BUCKET } from '../types';

export const generateV4UploadSignedUrl = (payload: {
  name: string;
  type: string;
  directory: Directory;
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      const { name, type, directory } = payload;

      const prefix = ValidFileTypes.has(type) ? `/.documentai` : '';

      const path = `${directory.fullPath}${prefix}/${name}`;

      const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: type,
      };

      // Get a v4 signed URL for uploading file

      const [url] = await StorageClient.bucket(STORAGE_BUCKET)
        .file(path)
        .getSignedUrl(options);

      console.log(`Generated PUT signed URL: ${url}`);

      resolve({ url })
    } catch (e) {
      reject(e);
    }
  });

export {};
