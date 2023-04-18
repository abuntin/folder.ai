import { Directory } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';

export const createDirectory: PropType<
  FolderManagerInterface,
  'create'
> = async (req, res) => {
  try {
    console.log('Initialised FolderManager.create()');

    const { name, directory, type } = req.body;

    if (!type || type !== 'create')
      return res
        .status(405)
        .json({ data: null, error: 'Invalid NextApiRequest type' });

    let dest = directory as Directory;

    if (
      !Object.prototype.hasOwnProperty.call(dest, 'path') ||
      !dest.isDirectory
    )
      return res
        .status(405)
        .json({ data: null, error: 'Invalid Directory in create' });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to create Directory' });
  }
};
