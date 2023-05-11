import { listAll } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';

export const initFolderManager: PropType<
  FolderManagerInterface,
  'init'
> = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      data: null,
      error: 'Method Not Allowed',
    });
    return;
  }
  try {
    console.log('Initialised FolderManager.init()');

    let listRes = await listAll(root);

    let rootRef = listRes.prefixes[0];

    let rootDirectory = {
      name: rootRef.name,
      path: Folder.pathFromFullPath(rootRef.fullPath),
      fullPath: rootRef.fullPath,
      isDirectory: true,
      id: 'rootID',
      url: rootRef.toString(),
    } as Directory;

    console.log('Obtained root folder')

    return res.status(200).json({ data: rootDirectory, error: null });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: 'Unable to fetch root folder' });
  }
};
