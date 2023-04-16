import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { copyS3, copy, netlifyResponse } from '../../functions';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

export const copyFolders: PropType<FolderManagerInterface, 'copy'> = async (
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
    console.log('Initialised FolderManager.copy()');

    const { folders, directory, type } = JSON.parse(event.body);

    if (!type || type !== 'copy')
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid NextApiRequest type',
      });
    if (
      !Array.isArray(folders) ||
      !Object.prototype.hasOwnProperty.call(folders[0], 'path')
    ) {
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid FolderList to copy',
      });
    }

    let srcList = folders.map(folder => folder as Folder);

    let dest = directory as Directory;

    let urls = [];

    for (let src of srcList) {
      let url = await copy(src, dest); //await copyS3(src, dest)

      urls.push(url);
    }

    if (urls.length === folders.length) {
      console.log(`Copied ${folders.length} Folders to ${dest.name}`);

      return netlifyResponse(200, { data: { urls }, error: null });
    } else throw new Error('Unable to copy some Folders');
  } catch (e) {
    console.error(e);
    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Unable to copy Folders',
    });
  }
};

// export const copyFolder: PropType<FolderManagerInterface, 'copy'> = async (
//   req,
//   res
// ) => {
//   try {
//     console.log('Initialised FolderManager.copy()');

//     const { folder, directory, type } = JSON.parse(event.body);

//     if (!type || type !== 'copy')
//       return res
//         .status(405)
//         .json({ data: null, error: 'Invalid NextApiRequest type' });

//     let src = folder as Folder;

//     let dest = directory as Directory;

//     let { urls } = await copy(src, dest);

//     console.log(`Copied ${src.name} to ${dest.name}`);

//     return res.status(200).json({ data: { url: urls }, error: null });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ data: null, error: 'Unable to copy Folder' });
//   }
// };
