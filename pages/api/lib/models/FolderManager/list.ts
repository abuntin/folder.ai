import { ref, listAll, getMetadata } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';

export const listFolder: PropType<FolderManagerInterface, 'list'> = async (
  req,
  res
) => {
  try {
    console.log('Initialised FolderManager.list()');
    const { directory, type } = req.body;

    if (!type || type !== 'list')
      return res
        .status(405)
        .json({ data: null, error: 'Invalid NextApiRequest type' });

    let src = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return res
        .status(400)
        .json({ data: null, error: "Invalid directory: Missing 'path'" });

    if (!src.isDirectory)
      res.status(400).json({ data: null, error: 'Called list on Folder' });

    const srcRef = ref(root, `${src.path}/`);

    let listRes = await listAll(srcRef);

    let folders = await Promise.all(
      listRes.items.map(async (ref, i) => {
        let metadata = await getMetadata(ref);

        return Folder.fromStorageReference(metadata);
      })
    );

    let directories = await Promise.all(
      listRes.prefixes.map(async (ref, i) => {
        // let metadata = await getMetadata(ref)

        // return Folder.fromStorageReference(metadata, true);

        return {
          name: ref.name,
          path: ref.fullPath,
          isDirectory: true,
          id: `rootID${100000 + i}`,
          url: ref.toString(),
          linkedFolders: [],
          children: [],
        } as Directory;
      })
    );

    console.log('Obtained Folder children');

    return res
      .status(200)
      .json({ data: { folders, directories }, error: null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ data: null, error: 'Unable to load Folder' });
  }
};
