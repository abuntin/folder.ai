import { ref, listAll, getMetadata } from "firebase/storage";
import { Directory, Folder } from "lib/models";
import { root } from "../models/firebase";

export const list = async (payload: { src: Directory, }): Promise<{ folders: Folder[], directories: Directory[] }> => new Promise(async (resolve, reject) => {
   try {

    let  { src } = payload;

    const srcRef = ref(root, `${src.path}/`);

    let listRes = await listAll(srcRef);

    let folders = await Promise.all(
      listRes.items.map(async (ref, i) => {
        let metadata = await getMetadata(ref);

        return Folder.fromStorageReference(metadata);
      })
    );

    let directories = await Promise.all(
      listRes.prefixes.map(async (ref, i) => {
        // let metadata = await getMetadata(ref)

        // return Folder.fromStorageReference(metadata, true);

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

    resolve({ folders, directories })
   }

   catch (e) {
       reject(e.message)
   }
})