import { copy, copyFirebaseStorage } from './copy';
import { Folder, Directory } from 'lib/models';
import { deleteFirebaseStorage, deleteFn } from './delete';
import { StorageReference } from 'firebase/storage';

export const move = async (payload: {
  src: Folder;
  dest: Directory;
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, dest } = payload;

      let result = await copy({ src, dest });

      if (result.url) {
        let value = await deleteFn(src);

        if (value) {
          resolve({ url: result.url });
        } else throw new Error('Unable to delete src Folder after copy: FolderManagerInterface.move helper');
      } else throw new Error('Unable to copy Folders in move fn: FolderManagerInterface.move helper');
    } catch (e) {
      reject(e.message);
    }
  });

export const moveFirebaseStorage = async (payload: {
  src: StorageReference;
  dest: StorageReference;
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, dest } = payload;

      let result = await copyFirebaseStorage({ src, dest });

      if (result.url) {

        let value = await deleteFirebaseStorage(src);

        if (value) resolve({ url: result.url });
      } else throw new Error('Unable to copy: moveFirebaseStorage');
    } catch (e) {
      reject(e.message);
    }
  });
