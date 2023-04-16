import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn, copyS3, copy, netlifyResponse } from '../../functions';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

export const renameFolder: PropType<FolderManagerInterface, 'rename'> = async (
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
    console.log('Initialised FolderManager.rename()');

    const { folder, name, directory, type } = JSON.parse(event.body);

    if (!type || type !== 'rename')
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid NextApiRequest type',
      });

    let _src = folder as Folder;

    let dest = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(folder, 'path')) {
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid Folder to rename',
      });
    }

    if (!Object.prototype.hasOwnProperty.call(directory, 'path'))
      return netlifyResponse(405, {
        data: null,
        error: 'Invalid Directory: missing path',
      });

    if (!dest.isDirectory)
      return netlifyResponse(400, {
        data: null,
        error: 'Destination Folder is not a Directory',
      });

    let parts = _src.path.split('/');

    let newPath = parts.slice(0, parts.length - 1).join('/') + `/${name}`;

    let src = { ..._src, name, path: newPath } as Folder;

    let url = await copy(src, dest); //await copyS3(src, dest);

    if (url) {
      let value = await deleteFn(_src);

      if (value) {
        console.log(`Renamed ${_src.name} to ${name} in ${directory.name}`);

        return netlifyResponse(200, { data: { url }, error: null });
      } else
        return netlifyResponse(500, {
          data: null,
          error: 'Unable to delete src Folder after copy',
        });
    } else
      return netlifyResponse(500, {
        data: null,
        error: 'Unable to copy Folders in rename fn',
      });
  } catch (e) {
    console.error(e);
    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Unable to rename Folder',
    });
  }
};
