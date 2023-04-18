import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn, copy } from '../../functions';

export const moveFolders: PropType<FolderManagerInterface, 'move'> = async (
  req,
  res
) => {
  try {
    console.log('Initialised FolderManager.move()');

    const { folders, directory, type } = req.body;

    if (!type || type !== 'move')
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

    if (!Object.prototype.hasOwnProperty.call(dest, 'path'))
      return res
        .status(400)
        .json({ data: null, error: "Invalid Directory: Missing 'path'" });

    if (!dest.isDirectory)
      res
        .status(400)
        .json({ data: null, error: 'Destination Folder is not a Directory' });

    let urls = [];

    for (let src of srcList) {
      let url = await copy(src, dest);

      if (url) {
        let value = await deleteFn(src);

        if (value) {
          urls.push(url);
        } else
          return res.status(500).json({
            data: null,
            error: 'Unable to delete src Folder after copy',
          });
      } else
        return res
          .status(500)
          .json({ data: null, error: 'Unable to copy Folders in move fn' });
    }

    if (urls.length === folders.length) {
      console.log(`Moved ${folders.length} Folders to ${dest.name}`);

      return res.status(200).json({ data: { urls }, error: null });
    } else throw new Error('Unable to move some Folders');
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to move Folder' });
  }
};
