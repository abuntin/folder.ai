import { ref, deleteObject } from 'firebase/storage';
import { Folder } from 'lib/models';
import { root } from '../models/firebase';

/**
 * Deletes single Folder in GCS
 * @param src Folder to delete
 * @returns True if deleted
 */

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
