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
import { getFolderMetadataRef } from './metadata';
import { upload } from './upload';

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

      const destRef = ref(root, `${dest.fullPath}`);

      const parentRef = ref(root, `/${Folder.getParentPath(src)}`);

      if (!parentRef) throw new Error('Could not find parent Directory path');

      if (ValidFileTypes.has(src.metadata.type)) {
        if (src.path.split('/').length < 3)
          // e.g. 'user/' ==> ['user', '']
          throw new Error('Tried to copy root');

        let srcRefDoc = ref(parentRef, `/.documentai/${src.name}`);

        let destRefDoc = ref(destRef, `/.documentai/${src.name}`);

        const metadata = await getMetadata(srcRef);

        // check if the src Folder is already in the target Directory

        let newMetadata = {
          ...metadata,
          name: src.path.includes(dest.path)
            ? `${metadata.name} ${Date.now().toString()}`
            : metadata.name,
          updated: Date.now().toString(),
        } as FullMetadata;

        let result = await copyFirebaseStorage({
          src: srcRefDoc,
          dest: destRefDoc,
          metadata: newMetadata,
        });

        if (result.url) {
          // Copy folder.ai metadata

          let getMetadataResult = await getFolderMetadataRef({
            parent: parentRef,
            name: src.name,
          });

          if (getMetadataResult.ref) {
            let srcRefMetadata = getMetadataResult.ref;

            let destRefMetadata = ref(destRef, `/.folderai/${src.name}`);

            let copyRes = await copyFirebaseStorage({
              src: srcRefMetadata,
              dest: destRefMetadata,
            });

            if (copyRes.url) resolve({ url: result.url });
            else throw new Error('Unable to copy metadata');

          } else throw new Error('Unable to find Folder metadata ref');
        }
      } else {
        const metadata = await getMetadata(srcRef);

        let newMetadata = {
          ...metadata,
          name: src.path.includes(dest.path)
            ? `${metadata.name} ${Date.now().toString()}`
            : metadata.name,
          updated: Date.now().toString(),
        } as FullMetadata;

        let result = await copyFirebaseStorage({
          src: srcRef,
          dest: destRef,
          metadata: newMetadata,
        });

        if (result.url) {
          resolve({ url: result.url });
        } else
          throw new Error(
            'Unable to copy Folder: FolderManagerInterface.copy helper'
          );
      }
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

        resolve({ url: result.url });
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
        else throw new Error('Unable to upload: copyFirebaseStorage');
      }
    } catch (e) {
      console.error(e.message);
      reject(e.message);
    }
  });
