import { ref, deleteObject, StorageReference } from 'firebase/storage';
import { Folder } from 'lib/models';
import { root } from '../models/firebase';
import { ValidFileTypes } from '../types';
import { getFolderMetadata, getFolderMetadataRef } from './metadata';

/**
 * Deletes single Folder in GCS
 * @param src Folder to delete
 * @returns True if deleted
 */

export const deleteFn = (src: Folder): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      if (!Object.prototype.hasOwnProperty.call(src, 'path'))
        reject("Invalid Folder: Missing 'path'");

      const srcRef = ref(root, `${src.fullPath}`);

      const parentRef = ref(root, `${Folder.getParentPath(src)}`);

      if (!parentRef) reject('Tried to delete root');

      if (ValidFileTypes.has(src.metadata.type)) {
        let srcRefDoc = ref(parentRef, `/.documentai/${src.name}`);

        let value = await deleteFirebaseStorage(srcRefDoc);

        if (value) {
          let getMetadataResult = await getFolderMetadataRef({
            parent: parentRef,
            name: src.name,
          });

          if (getMetadataResult.ref) {
            let valMetadata = await deleteFirebaseStorage(
              getMetadataResult.ref
            );

            if (valMetadata) resolve(true);
            else throw new Error('Unable to delete Folder metadata');
          } else throw new Error('Unable to get Folder metadata ref');
        } else throw new Error('Unable to delete Folder document');
      } else {
        let value = await deleteFirebaseStorage(srcRef);

        if (value) resolve(true);
        else throw new Error('Unable to delete from Firebase Storage');
      }
    } catch (e) {
      reject(e.message);
    }
  });

export const deleteFirebaseStorage = async (
  src: StorageReference
): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      deleteObject(src)
        .then(() => resolve(true))
        .catch(error => reject(error.message));
    } catch (e) {
      reject(e.message);
    }
  });
