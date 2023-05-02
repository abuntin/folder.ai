import { getBytes, listAll, ref, StorageReference } from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { root } from '../models/firebase';
import { moveFirebaseStorage } from './move';


export const getFolderMetadata = async (payload: { parent: Directory, name: string }): Promise<{ metadata: string }> => new Promise(async (resolve, reject) => {
   try {
        let { parent, name } = payload;

        let metadataSrcRef = ref(root, `${parent.fullPath}/.folderai`)

        let metadataRefs = await listAll(metadataSrcRef)

        let metadataFilter = metadataRefs.items.filter(ref => ref.name.includes(name))

        if (metadataFilter.length) {
            let metadataRef = metadataFilter[0]

            console.log('metadataRef', metadataRef)

            let arrayBuffer = await getBytes(metadataRef)

            let buffer = Buffer.from(arrayBuffer)

            let metadata = buffer.toString()

            resolve({ metadata })
        }

        else reject('Unable to get Folder metadata')
   }
   catch (e) {
       reject(e.message)
   }
})
// Path to metadata: SourceDirectory -> .folderai -> {docaigeneration} -> {indexFolders}
export const processDirectoryNewUpload = async (payload: {
  src: Directory;
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src } = payload;

      let srcRef = ref(root, `${src.fullPath}/.folderai`);

      // List DocumentAI generation folders

      let generations = await listAll(srcRef);

      if (!generations.prefixes.length) resolve(null);

      let latestGenerationRef = generations.prefixes[0]; // Latest generation first

      let indexFoldersRes = await listAll(latestGenerationRef);

      let indexFoldersRefs = indexFoldersRes.prefixes;

      for (let indexFoldersRef of indexFoldersRefs) {
        try {
          let itemResult = await listAll(indexFoldersRef);

          let itemRef = itemResult.items.length ? itemResult.items[0] : null;

          let dest = ref(srcRef, `/${itemRef.name}`)

          let { url } = await moveFirebaseStorage({
            src: itemRef,
            dest,
          });

          if (url) continue;

          else throw new Error('Unable to move metadata file')
        } catch (e) {
          throw new Error(e.message);
        }
      }

      resolve(true)
    } catch (e) {
      reject(e.message);
    }
  });

//   let url = await copy(src, dest);

//   if (url) {
//     let value = await deleteFn(src);

//     if (value) {
//       urls.push(url);
//     } else
//       return res.status(500).json({
//         data: null,
//         error: 'Unable to delete src Folder after copy',
//       });
//   } else
//     return res
//       .status(500)
//       .json({ data: null, error: 'Unable to copy Folders in move fn' });
