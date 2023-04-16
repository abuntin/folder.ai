import { HandlerEvent, HandlerContext } from '@netlify/functions';
import { ref, listAll, getMetadata } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { list, netlifyResponse } from '../../functions';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';

// export const listFolder: PropType<FolderManagerInterface, 'list'> = async (
//   req,
//   res
// ) => {
//   try {
//     console.log('Initilaised FolderManager.list()');

//     const { directory, type } = JSON.parse(event.body);

//     if (!type || type !== 'list')
//       return res
//         .status(405)
//         .json({ data: null, error: 'Invalid NextApiRequest type' });

//     let src = directory as Directory;

//     if (!Object.prototype.hasOwnProperty.call(src, 'path'))
//       return res
//         .status(400)
//         .json({ data: null, error: "Invalid directory: Missing 'path'" });

//     if (!src.isDirectory)
//       res.status(400).json({ data: null, error: 'Called list on Folder' });

//     let { folders, directories } = await list(src);

//     console.log(
//       `Obtained ${src.name} Directory children`,
//       folders,
//       directories
//     );

//     return res
//       .status(200)
//       .json({ data: { folders, directories }, error: null });
//   } catch (e) {
//     console.error(e);

//     return res.status(500).json({ data: null, error: e.message });
//   }
// };

export const listFolder: PropType<FolderManagerInterface, 'list'> = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== 'POST') {
    return netlifyResponse(200, {
      data: null,
      error: 'Method Not Allowed',
    });
  }
  try {
    console.log('Initialised FolderManager.list()');
    const { directory, type } = JSON.parse(event.body);

    if (!type || type !== 'list')
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid NextApiRequest type',
      });

    let src = directory as Directory;

    //console.log(src, directory);

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return netlifyResponse(400, {
        data: null,
        error: "Invalid directory: Missing 'path'",
      });

    if (!src.isDirectory)
      return netlifyResponse(400, {
        data: null,
        error: 'Called list on Folder',
      });

    const srcRef = ref(root, `${src.path}/`);

    let listRes = await listAll(srcRef);

    let folders = await Promise.all(
      listRes.items.map(async (ref, i) => {
        let metadata = await getMetadata(ref);

        return Folder.fromStorageReference(metadata);

        // return {
        //   name: ref.name,
        //   path: ref.fullPath,
        //   isDirectory: false,
        //   id: 'rootID' + i,
        //   url: ref.toString(),
        // } as Folder;
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
          id: `rootID${100000 + i}`,
          url: ref.toString(),
          linkedFolders: [],
          children: [],
        } as Directory;
      })
    );

    console.log('Obtained Folder children');

    return netlifyResponse(200, {
      data: { folders, directories },
      error: null,
    });
  } catch (e) {
    console.error(e);

    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Unable to load Folder',
    });
  }
};
