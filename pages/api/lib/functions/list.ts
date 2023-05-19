import {
  getMetadata,
  listAll as storageList,
  ref,
} from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { DOCUMENT_PATH } from '../types';
import { root } from '../models/firebase'
import { getUserMetadata } from './metadata';

export const list = async (payload: {
  src: Folder;
}): Promise<{ folders: Folder[]; directories: Directory[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src } = payload;

      let { metadata } = await getUserMetadata();

      const srcRef =
        src.name === root.name ? root : ref(root, `/${src.fullPath}`);

      let listRes = await storageList(srcRef);

      // Handle unsupported mimetypes

      let folders = await Promise.all(
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

      if (src.isDirectory) {
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

        folders = processed.concat(folders);
      }

      // Get sub-Directories

      let directories = !src.isDirectory
        ? []
        : await Promise.all(
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
