import { StorageReference } from 'firebase/storage';
import { Folder, Directory } from 'lib/models';
import { list } from '../../functions';

export const listFolder = async (
  req,
  res,
  root: StorageReference
): Promise<{ data: { folders: Folder[], directories: Directory[] } | null, error: string | null }> => {
  try {
    console.log('Initialised FolderManager.list()');
    const { directory, type } = req.body;

    if (!type || type !== 'list')
      return { data: null, error: 'Invalid NextApiRequest type' };

    let src = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return { data: null, error: "Invalid directory: Missing 'path'" };

    if (!src.isDirectory)
      return { data: null, error: 'Called list on Folder' };

    let { folders, directories } = await list({ src, root })

    console.log('Obtained Folder children');

    return { data: { folders, directories }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to load Folder' };
  }
};
