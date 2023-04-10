import { root } from '../firebase';
import { getMetadata, listAll } from 'firebase/storage';
import { PropType } from 'lib/types';
import { Folder } from 'lib/models';
import { FolderManagerInterface } from '../../types';

export const initFolderManager: PropType<
  FolderManagerInterface,
  'init'
> = async (req, res) => {
  try {
    console.log('Initialised FolderManager.init()');

    let listRes = await listAll(root);

    let ref = listRes.prefixes[0];

    let rootFolder = {
      name: ref.name,
      path: ref.fullPath,
      isDirectory: true,
      id: 'rootID',
      url: ref.toString(),
    } as Folder;

    console.log('Obtained root folder');

    return res.status(200).json({ data: rootFolder, error: null });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ data: null, error: 'Unable to fetch root folder' });
  }
};
