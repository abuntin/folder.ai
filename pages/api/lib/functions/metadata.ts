import {
  getBytes,
  getMetadata,
  ref,
  StorageReference,
  updateMetadata,
  UploadMetadata,
} from 'firebase/storage';
import { root } from '../models/firebase';
import { METADATA_PATH } from '../types';
import { Directory, FolderAIMetadata } from 'lib/models';
import { upload } from './upload';
import { ValueOf } from 'next/dist/shared/lib/constants';

export const getUserMetadata = async (): Promise<{
  metadata: Record<string, any>;
}> =>
  new Promise(async (resolve, reject) => {
    try {
      let srcRef = ref(root, `/${METADATA_PATH}`);

      let arrayBuffer = await getBytes(srcRef);

      let metadata = new TextDecoder('utf-8').decode(
        new Uint8Array(arrayBuffer)
      );

      resolve({ metadata: JSON.parse(metadata) });
    } catch (e) {
      console.error(e);
      reject(e.message);
    }
  });

export const setUserMetadata = async (payload: {
  src: Directory;
  metadata: Partial<ValueOf<FolderAIMetadata>>
}): Promise<{
  url: string
}> =>
  new Promise(async (resolve, reject) => {
    try {
      const { src, metadata } = payload;

      let { metadata: oldMetadata } = await getUserMetadata();

      let metadataJSON = JSON.stringify({
        ...oldMetadata,
        [src.name]: {
          ...src.metadata,
          ...metadata,
        },
      });

      let destRef = ref(root, `/${METADATA_PATH}`);

      let uploadMetadata: UploadMetadata = {
        contentType: 'application/json',
      };


      let data = new TextEncoder().encode(metadataJSON);

      let uploadResult = await upload({
        data,
        ref: destRef,
        metadata: uploadMetadata,
      });

      if (!uploadResult.url) throw new Error();

      let { url } = uploadResult

      resolve({ url })
    } catch (e) {
      reject(e.message);
    }
  });

export const markAsIndexed = async (payload: {
  src: (string | StorageReference)[];
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    const getAndSetMetadata = async (src: string | StorageReference) => {
      let srcRef = typeof src === 'string' ? ref(root, src) : src;

      let _m = await getMetadata(srcRef);

      let metadata = {
        customMetadata: { ..._m.customMetadata, indexed: 'true' },
      };

      let result = await updateMetadata(srcRef, metadata);

      return result.customMetadata.indexed == 'true';
    };

    try {
      const { src } = payload;

      let result = await Promise.all(
        src.map(async _src => await getAndSetMetadata(_src))
      );

      if (result.includes(false)) throw new Error();

      resolve(true);
    } catch (e) {
      reject(e?.message ?? 'Unable to mark Folder as indexed');
    }
  });
