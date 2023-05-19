import { ref, deleteObject, StorageReference } from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { root } from '../models/firebase';
import { ValidFileTypes, DOCUMENT_PATH } from '../types';
import { deleteFromPinecone } from './document';

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
        let srcRefDoc = ref(parentRef, `/${DOCUMENT_PATH}/${src.name}`);

        let value = await deleteFirebaseStorage(srcRefDoc);

        if (!value) throw new Error('Unable to delete Folder document');
        let pineconeResult = await deleteFromPinecone({
          src: Directory.fromStorageReference({
            reference: parentRef,
            id: 'temp',
            metadata: {},
          }),
          refs: [srcRef],
        });

        if (!pineconeResult)
          throw new Error('Unable to delete Folder index from pinecone');

        resolve(true);
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
