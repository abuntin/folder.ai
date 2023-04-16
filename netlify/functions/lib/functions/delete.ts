import { DeleteObjectCommand, DeleteObjectCommandInput } from '@aws-sdk/client-s3';
import { ref, deleteObject } from 'firebase/storage';
import { Folder } from 'lib/models';
import { root } from '../models/firebase';
import { BUCKET_NAME, s3 } from '../models/s3';

// export const deleteFn = (src: Folder): Promise<true> =>
//   new Promise(async (resolve, reject) => {
//     try {
//       if (!Object.prototype.hasOwnProperty.call(src, 'path'))
//         reject("Invalid Folder: Missing 'path'");

//       let params: DeleteObjectCommandInput = {
//         Bucket: BUCKET_NAME,
//         Key: src.path
//       }
//       const command = new DeleteObjectCommand(params);

//       const response = await s3.send(command);

//       resolve(true)

//     } catch (e) {
//       reject(e.message);
//     }
//   });

export const deleteFn = (src: Folder): Promise<true> =>
  new Promise((resolve, reject) => {
    try {
      if (!Object.prototype.hasOwnProperty.call(src, 'path'))
        reject("Invalid Folder: Missing 'path'");
      const srcRef = ref(root, `${src.path}/`);

      const parentRef = srcRef.parent;

      if (!parentRef) reject('Tried to delete root');

      deleteObject(srcRef)
        .then(() => resolve(true))
        .catch(error => reject(error.message));
    } catch (e) {
      reject(e.message);
    }
  });
