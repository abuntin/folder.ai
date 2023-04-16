import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn, copyS3, copy, netlifyResponse } from '../../functions';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

export const moveFolders: PropType<FolderManagerInterface, 'move'> = async (
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
    console.log('Initialised FolderManager.move()');

    const { folders, directory, type } = JSON.parse(event.body);

    if (!type || type !== 'move')
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
        error: 'Invalid FolderList to move',
      });
    }

    let srcList = folders.map(folder => folder as Folder);

    let dest = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(dest, 'path'))
      return netlifyResponse(400, {
        data: null,
        error: 'Invalid Directory: missing path',
      });

    if (!dest.isDirectory)
      return netlifyResponse(400, {
        data: null,
        error: 'Destination Folder is not a Directory',
      });

    let urls = [];

    for (let src of srcList) {
      let url = await copy(src, dest); //await copyS3(src, dest);

      if (url) {
        let value = await deleteFn(src);

        if (value) {
          urls.push(url);
        } else
          return netlifyResponse(500, {
            data: null,
            error: 'Unable to delete src Folder after copy',
          });
      } else
        return netlifyResponse(500, {
          data: null,
          error: 'Unable to copy Folders in move()',
        });
    }

    if (urls.length === folders.length) {
      console.log(`Moved ${folders.length} Folders to ${dest.name}`);

      return netlifyResponse(200, { data: { urls }, error: null });
    } else throw new Error('Unable to move some Folders');
  } catch (e) {
    console.error(e);

    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Unable to move Folder',
    });
  }
};
