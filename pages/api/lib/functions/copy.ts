import {
  ref,
  getMetadata,
  FullMetadata,
  getBytes,
  StorageReference,
} from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { root } from '../models/firebase';
import { ValidFileTypes } from '../types';
import { upload } from './upload';

/**
 * Copies one Folder to given destination in GCS
 * @param src Folder to copy
 * @param dest Directory to copy to
 * @returns
 */
export const copy = (payload: {
  src: Folder;
  dest: Directory;
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      const { src, dest } = payload;
      if (
        !Object.prototype.hasOwnProperty.call(src, 'path') ||
        !Object.prototype.hasOwnProperty.call(dest, 'path')
      )
        reject("Invalid Folder: Missing 'path'");

      if (src.isDirectory) reject('Cannot copy Directory');

      if (!dest.isDirectory) reject('Destination Folder is not a Directory');

      const srcRef = ref(root, `${src.fullPath}/`);

      let destPrefix = ValidFileTypes.has(src.metadata.type)
        ? `.documentai/`
        : '';

      // TODO: copy .folderai metadata as well

      const destRef = ref(root, `${dest.path}/${destPrefix}${src.name}`);

      const parentRef = srcRef.parent;

      if (!parentRef) reject('Tried to copy root');


      const metadata = await getMetadata(srcRef);

      // check if the src Folder is already in the target Directory

      let newMetadata = {
        ...metadata,
        name: src.path.includes(dest.path)
          ? `${metadata.name} ${Date.now().toString()}`
          : metadata.name,
        updated: Date.now().toString(),
      } as FullMetadata;

      let result = await copyFirebaseStorage({ src: srcRef, dest: destRef, metadata: newMetadata });


      if (result.url) resolve({url: result.url })

      else throw new Error('Unable to copy Folder: FolderManagerInterface.copy helper')
    } catch (e) {
      reject(e.message);
    }
  });

export const copyFirebaseStorage = async (payload: {
  src: StorageReference;
  dest: StorageReference;
  metadata?: FullMetadata;
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, dest, metadata } = payload;

      if (metadata) {
        const buffer = await getBytes(src);

        let result = await upload(buffer, metadata, dest);

        if (result.url) resolve({ url: result.url });

      } else {
        const metadata = await getMetadata(src);

        let newMetadata = {
          ...metadata,
          name: metadata.name,
          updated: Date.now().toString(),
        } as FullMetadata;

        const buffer = await getBytes(src);

        let result = await upload(buffer, newMetadata, dest);

        if (result.url) resolve({ url: result.url });

        else throw new Error('Unable to upload: copyFirebaseStorage')

      }
    } catch (e) {
      console.error(e.message)
      reject(e.message);
    }
  });
