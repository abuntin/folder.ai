import { getMetadata, listAll, ref } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { root } from '../models/firebase';
import { getFolderMetadata } from './metadata';

export const list = async (payload: {
  src: Directory;
}): Promise<{ folders: Folder[]; directories: Directory[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src } = payload;

      const srcRef = ref(root, `${src.fullPath}/`);

      let listRes = await listAll(srcRef);

      // Handle unsupported mimetypes

      let unprocessed = await Promise.all(
        listRes.items.map(async (ref, i) => {
          let _m = await getMetadata(ref);
          return Folder.fromGStorageMetadata({
            fullMetadata: _m,
            metadata: '',
          });
        })
      );

      // Get processed folders

      const documentSrcRef = ref(srcRef, `/.documentai`);

      let docsRes = await listAll(documentSrcRef);

      let processed = await Promise.all(
        docsRes.items.map(async _ => {
          let _m = await getMetadata(_);
          let { metadata } = await getFolderMetadata({
            parent: src,
            name: _.name,
          });

          return Folder.fromGStorageMetadata({ fullMetadata: _m, metadata });
        })
      );

      let folders = processed.concat(unprocessed);

      let directories = listRes.prefixes
        .map(ref => {
          if (
            ref.name.includes('.documentai') ||
            ref.name.includes('.folderai')
          )
            return null;
          return Directory.fromStorageReference({ reference: ref, id: null })
        })
        .filter(n => n);

      resolve({ folders, directories });
    } catch (e) {
      reject(e.message);
    }
  });
