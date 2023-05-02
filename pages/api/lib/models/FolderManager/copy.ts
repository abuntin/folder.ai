import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { copy } from '../../functions';

export const copyFolders: PropType<FolderManagerInterface, 'copy'> = async (
  req,
  res
) => {
  try {
    console.log('Initialised FolderManager.copy()');

    const { folders, directory, type } = JSON.parse(req.body)

    if (!type || type !== 'copy')
      return res
        .status(405)
        .json({ data: null, error: 'Invalid NextApiRequest type' });

    if (
      !Array.isArray(folders) ||
      !Object.prototype.hasOwnProperty.call(folders[0], 'path')
    ) {
      return res
        .status(405)
        .json({ data: null, error: 'Invalid Folder list to copy' });
    }

    let srcList = folders.map(folder => folder as Folder);

    let dest = directory as Directory;

    let urls = [];

    for (let src of srcList) {
      let {url} = await copy({src, dest});

      urls.push(url);
    }

    if (urls.length === folders.length) {
      console.log(`Copied ${folders.length} Folders to ${dest.name}`);

      return res.status(200).json({ data: { urls }, error: null });
    } else throw new Error('Unable to copy some Folders');
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to copy Folders' });
  }
};
