import { Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn, netlifyResponse } from '../../functions';
import { HandlerContext, HandlerEvent } from '@netlify/functions';

export const deleteFolders: PropType<FolderManagerInterface, 'delete'> = async (
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
    console.log('Initialised FolderManager.delete()');

    const { folders, type } = JSON.parse(event.body);

    if (!type || type !== 'delete')
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
        error: 'Invalid FolderList to delete',
      });
    }

    let srcList = folders.map(folder => folder as Folder);

    let vals = [];

    for (let src of srcList) {
      let val = await deleteFn(src);

      if (val == true) vals.push(val);
      else throw new Error('Unable to delete Folder');
    }

    if (vals.length === folders.length) {
      console.log(`Deleted ${folders.length} Folders`);

      return netlifyResponse(200, { data: true, error: null });
    } else throw new Error('Unable to delete some Folders');
  } catch (e) {
    console.error(e);

    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Unable to delete Folders',
    });
  }
};
