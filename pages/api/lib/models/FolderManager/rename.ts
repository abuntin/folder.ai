import _ from 'lodash';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn, copy } from '../../functions';

export const renameFolder: PropType<FolderManagerInterface, 'rename'> = async (
  req,
  res
) => {
  try {
    console.log('Initialised FolderManager.rename()');

    const { folder, name, directory, type } = req.body;

    if (!type || type !== 'rename')
      return res
        .status(405)
        .json({ data: null, error: 'Invalid NextApiRequest type' });

    let _src = folder as Folder;

    let dest = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(folder, 'path')) {
      return res
        .status(405)
        .json({ data: null, error: 'Invalid Folder to rename' });
    }

    if (!Object.prototype.hasOwnProperty.call(directory, 'path'))
      return res
        .status(400)
        .json({ data: null, error: "Invalid Directory: Missing 'path'" });

    if (!dest.isDirectory)
      res
        .status(400)
        .json({ data: null, error: 'Destination Folder is not a Directory' });

    let parts = _src.path.split('/');

    let newPath = parts.slice(0, parts.length - 1).join('/') + `/${name}`;

    let src = { ..._src, name, path: newPath } as Folder;

    let url = await copy(src, dest);

    if (url) {
      let value = await deleteFn(_src);

      if (value) {
        console.log(`Renamed ${_src.name} to ${name} in ${directory.name}`);

        return res.status(200).json({ data: { url }, error: null });
      } else
        return res.status(500).json({
          data: null,
          error: 'Unable to delete src Folder after copy',
        });
    } else
      return res
        .status(500)
        .json({ data: null, error: 'Unable to copy Folders in rename fn' });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to rename Folder' });
  }
};
