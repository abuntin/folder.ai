import { list } from 'firebase/storage';
import { Directory } from 'lib/models';
import { root as rootStorage } from '../firebase';

export const initFolderManager = async (
  req,
  res
): Promise<{
  data: {
    root: Directory;
  };
  error: string | null;
}> => {
  try {

    let { type } = req.body

    if (!type || type !== 'init') return { data: null, error: 'Invalid NextApiRequest type'}

    console.log('Initialised FolderManager.init()');

    let root = Directory.fromStorageReference({
      id: 'root',
      reference: rootStorage
    });

    // let processResult = await indexDirectory({ src: rootDirectory })

    console.log('Obtained root folder');

    return { data: { root }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to fetch root folder' };
  }
};
