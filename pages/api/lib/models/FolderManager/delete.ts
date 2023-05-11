import { Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { deleteFn } from '../../functions';

export const deleteFolders: PropType<FolderManagerInterface, 'delete'> = async (
  req,
  res
) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      data: null,
      error: 'Method Not Allowed',
    });
    return;
  }
  try {
    console.log('Initialised FolderManager.delete()');

    const { folders, type } = req.body;

    if (!type || type !== 'delete')
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

    let vals = [];

    for (let src of srcList) {
      let val = await deleteFn(src);

      if (val == true) vals.push(val);
      else throw new Error('Unable to delete Folder');
    }

    if (vals.length === folders.length) {
      console.log(`Deleted ${folders.length} Folders`);

      return res.status(200).json({ data: true, error: null });
    } else throw new Error('Unable to delete some Folders');
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to delete Folders' });
  }
};
