import { ref, listAll, getMetadata, StorageReference } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { root } from '../models/firebase';
import { typeFromPath, ValidFileTypes } from '../types';

export const list = async (payload: {
  src: Directory;
}): Promise<{ folders: Folder[]; directories: Directory[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src } = payload;

      const srcRef = ref(root, `${src.path}/.documentai`);

      let listRes = await listAll(srcRef);

      const getFolders = async (ref: StorageReference) => {
        let _listRes = await listAll(ref);

        return await Promise.all(
          _listRes.items.map(async _ => {
            let _m = await getMetadata(_);
            return Folder.fromStorageReference(_m);
          })
        );
      };

      let folders = [] as Folder[];

      // Handle unsupported mimetypes

      let unprocessed = await Promise.all(
        listRes.items.map(async (ref, i) => {
          let _m = await getMetadata(ref);
          return Folder.fromStorageReference(_m);
        })
      );

      folders = folders.concat(unprocessed)

      let directories = await Promise.all(
        listRes.prefixes.map(async (ref, i) => {
          let isTypeDirectory = ValidFileTypes.has(typeFromPath(ref.name));

          if (isTypeDirectory) {
            let _folders = await getFolders(ref);
            folders = folders.concat(_folders);
          } else
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
        })
      );

      resolve({ folders, directories });
    } catch (e) {
      reject(e.message);
    }
  });
