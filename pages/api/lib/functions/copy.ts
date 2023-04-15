import { ref, getMetadata, FullMetadata, getBytes } from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { root } from '../models/firebase';
import { upload } from './upload';

export const copy = (
  src: Folder,
  dest: Directory
): Promise<{ urls: string[] }> =>
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

      const srcRef = ref(root, `${src.path}/`);

      const destRef = ref(root, `${dest.path}/${src.name}`);

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

      let value = await upload(buffer, newMetadata, destRef);

      resolve(value);
    } catch (e) {
      reject(e.message);
    }
  });
