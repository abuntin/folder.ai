import { Folder, Directory } from 'lib/models';
import { indexDirectory } from '../../functions/document';

export const index = async (
  req,
  res,
): Promise<{ data: { indexed: string }; error: string | null }> => {
  try {
    let { folder, type } = req.body;

    console.log(folder, type)

    if (!type || type !== 'index')
      return { data: null, error: 'Invalid NextApiRequest type' };

    let src = folder as Folder;

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return { data: null, error: "Invalid Folder: Missing 'path'" };

    if (src.isDirectory) {

      let pineconeResult = await indexDirectory({ src: src as Directory });

      if (!pineconeResult) throw new Error();
      else return { data: { indexed: pineconeResult.indexed }, error: null };
    }

    else return { data: { indexed: '' }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to index Directory' };
  }
};
