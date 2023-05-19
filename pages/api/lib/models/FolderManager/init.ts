import { list } from 'firebase/storage';
import { Directory, FolderAIMetadata } from 'lib/models';
import { getUserMetadata } from '../../functions';
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

    let listRes = await list(rootStorage);

    let rootRef = listRes.prefixes[0];

    let root = Directory.fromStorageReference({
      reference: rootRef,
      id: 'root',
    });

    // let processResult = await indexDirectory({ src: rootDirectory })

    console.log('Obtained root folder');

    return { data: { root }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to fetch root folder' };
  }
};
