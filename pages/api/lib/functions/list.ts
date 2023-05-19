import {
  getMetadata,
  listAll as storageList,
  ref,
  StorageReference,
} from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { DOCUMENT_PATH } from '../types';
import { getUserMetadata } from './metadata';

export const list = async (payload: {
  src: Directory;
  root: StorageReference;
}): Promise<{ folders: Folder[]; directories: Directory[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, root } = payload;

      let { metadata } = await getUserMetadata({ rootRef: root });

      const srcRef =
        src.name === root.name ? root : ref(root, `/${src.fullPath}`);

      let listRes = await storageList(srcRef);

      // Handle unsupported mimetypes

      let unprocessed = await Promise.all(
        listRes.items
          .map(async (ref, i) => {
            if (ref.name[0] == '.') return null;
            let _m = await getMetadata(ref);
            return Folder.fromGStorageMetadata({
              metadata: _m,
              isDirectory: false,
            });
          })
          .filter(n => n)
      );

      // Get processed folders

      const documentSrcRef = ref(srcRef, DOCUMENT_PATH);

      let docsRes = await storageList(documentSrcRef);

      let processed = await Promise.all(
        docsRes.items.map(async _ => {
          let _m = await getMetadata(_);

          return Folder.fromGStorageMetadata({
            metadata: _m,
            isDirectory: false,
          });
        })
      );

      let folders = processed.concat(unprocessed);

      console.log(metadata);
      // Get sub-Directories

      let directories = await Promise.all(
        listRes.prefixes
          .map(ref => {
            if (ref.name[0] == '.') return null;

            let _m = metadata[ref.name];

            return Directory.fromStorageReference({
              reference: ref,
              metadata: _m,
            });
          })
          .filter(n => n)
      );

      resolve({ folders, directories });
    } catch (e) {
      reject(e.message);
    }
  });
