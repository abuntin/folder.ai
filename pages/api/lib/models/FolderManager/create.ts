import { Directory } from 'lib/models';
import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../../types';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, s3 } from '../s3';

export const createDirectory: PropType<FolderManagerInterface, 'create'> = async (
  req,
  res
) => {
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

    let Key = `${directory.path}/${name}/`;

    let command = new PutObjectCommand({
      Key,
      Bucket: BUCKET_NAME,
      Metadata: {},
      ContentLength: 0
    });

    let result = await s3.send(command);

    if (result.ETag) {
      console.log(`Created new Directory ${name} in ${directory.name}`);

      return res.status(200).json({ data: { url: result.ETag }, error: null });
    } else throw new Error('Unable to delete some Folders');
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Unable to create Directory' });
  }
};
