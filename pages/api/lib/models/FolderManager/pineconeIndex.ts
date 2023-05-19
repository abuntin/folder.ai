import { Directory } from 'lib/models';
import { indexDirectory } from '../../functions/document';

export const index = async (
  req,
  res,
  rootRef
): Promise<{ data: { indexed: string }; error: string | null }> => {
  try {
    let { directory, type } = req.body;

    if (!type || type !== 'index')
      return { data: null, error: 'Invalid NextApiRequest type' };

    let src = directory as Directory;

    if (!Object.prototype.hasOwnProperty.call(src, 'path'))
      return { data: null, error: "Invalid directory: Missing 'path'" };

    let pineconeResult = await indexDirectory({ src: directory, rootRef });

    if (!pineconeResult) throw new Error();
    else return { data: { indexed: pineconeResult.indexed }, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Unable to index Directory' };
  }
};
