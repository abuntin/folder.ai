import { ref, listAll, getMetadata, StorageReference } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { root } from '../models/firebase';
import { typeFromPath, ValidFileTypes } from '../types';
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
          return Folder.fromStorageReference({
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
          let name = _.name.replace(/\.[^/.]+$/, "") // remove file extension
          let { metadata } = await getFolderMetadata({
            parent: src,
            name,
          });

          return Folder.fromStorageReference({ fullMetadata: _m, metadata });
        })
      );

      let folders = processed.concat(unprocessed);

      let directories = listRes.prefixes.map((ref, i) => {
        if (ref.name.includes('.documentai') || ref.name.includes('.folderai'))
          return null;
        return {
          name: ref.name,
          path: ref.fullPath,
          isDirectory: true,
          metadata: { type: '', size: 0 },
          id: `rootID${100000 + i}`,
          url: ref.toString(),
          linkedFolders: [],
          children: [],
        } as Directory;
      }).filter(n => n)

      resolve({ folders, directories });
    } catch (e) {
      reject(e.message);
    }
  });
