import { ref, getMetadata, FullMetadata, getBytes } from 'firebase/storage';
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
export const copy = (
  src: Folder,
  dest: Directory
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(src, dest);
      if (
        !Object.prototype.hasOwnProperty.call(src, 'path') ||
        !Object.prototype.hasOwnProperty.call(dest, 'path')
      )
        reject("Invalid Folder: Missing 'path'");

      if (src.isDirectory) reject('Cannot copy Directory');

      if (!dest.isDirectory) reject('Destination Folder is not a Directory');

      const srcRef = ref(root, `${src.fullPath}/`);

      let destPrefix = ValidFileTypes.has(src.metadata.type) ? `.documentai/` : ''

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

      const buffer = await getBytes(srcRef);

      let url = await upload(buffer, newMetadata, destRef);

      resolve(url);
    } catch (e) {
      reject(e.message);
    }
  });
