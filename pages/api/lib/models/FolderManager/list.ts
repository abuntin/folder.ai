import { Folder, Directory } from 'lib/models';
import { list } from '../../functions';

export const listFolder = async (
  req,
  res,
): Promise<{ data: { folders: Folder[], directories: Directory[] } | null, error: string | null }> => {
  try {
    console.log('Initialised FolderManager.list()');
    const { folder, type } = req.body;

    if (!type || type !== 'list')
      return { data: null, error: 'Invalid NextApiRequest type' };

    let src = folder as Folder;

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return { data: null, error: "Invalid directory: Missing 'path'" };

    let { folders, directories } = await list({ src })

    console.log('Obtained Folder children');

    return { data: { folders, directories }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to load Folder' };
  }
};
