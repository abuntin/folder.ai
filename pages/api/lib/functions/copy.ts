import {
  ref,
  getMetadata,
  FullMetadata,
  getBytes,
  StorageReference,
} from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { root } from '../models/firebase';
import { ValidFileTypes, DOCUMENT_PATH } from '../types';
import { upload } from './upload';
import { indexToPinecone } from './document';
import { markAsIndexed } from './metadata';
import { getDocumentPath } from '.';
import { Dayjs } from 'dayjs';


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

        let srcRefDoc = ref(parentRef, `/${DOCUMENT_PATH}/${src.name}`);

        let destRefDoc = ref(destRef, `/${DOCUMENT_PATH}/${src.name}`);

        const metadata = await getMetadata(srcRef);

        // Update metadata

        let newMetadata = {
          ...metadata,
          name: src.path.includes(dest.path)
            ? `${metadata.name} ${Date.now().toString()}`
            : metadata.name,
          updated: new Dayjs(Date.now()).toISOString(),
        } as FullMetadata;

        let result = await copyFirebaseStorage({
          src: srcRefDoc,
          dest: destRefDoc,
          metadata: newMetadata,
        });

        if (!result.url) throw new Error();

        let pineconeResult = await indexToPinecone({
          src: dest,
          refs: [destRefDoc],
        });

        if (!pineconeResult) throw new Error('Error indexing copy to Pinecone');

        let metadataResult = await markAsIndexed({
          src: [getDocumentPath({ src: dest, name: destRefDoc.name })],
        });

        if (!metadataResult) throw new Error();

        console.log('Marked as indexed');

        resolve({ url: result.url });
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
        const data = await getBytes(src);

        let result = await upload({ data, ref: dest, metadata });

        resolve({ url: result.url });
      } else {
        const metadata = await getMetadata(src);

        let newMetadata = {
          ...metadata,
          name: metadata.name,
          updated: Date.now().toString(),
        } as FullMetadata;

        const data = await getBytes(src);

        let result = await await upload({
          data,
          ref: dest,
          metadata: newMetadata,
        });

        if (result.url) resolve({ url: result.url });
        else throw new Error('Unable to upload: copyFirebaseStorage');
      }
    } catch (e) {
      console.error(e.message);
      reject(e.message);
    }
  });
