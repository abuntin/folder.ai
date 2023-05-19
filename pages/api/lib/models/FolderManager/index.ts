import { FolderManagerInterface } from '../../types';
import { listFolder } from './list';
import { uploadFolder } from './upload';
import { initFolderManager } from './init';
import { deleteFolders } from './delete';
import { copyFolders } from './copy';
import { moveFolders } from './move';
import { createDirectory } from './create';
import { renameFolder } from './rename';
import { index } from './pineconeIndex';
import { NextApiRequest, NextApiResponse } from 'next';

export class FolderManager implements FolderManagerInterface {

  constructor(data?: Partial<FolderManager>) {
    if (data) {
      let keys = Object.keys(this);

      for (let key of keys) {
        if (Object.prototype.hasOwnProperty.call(data, key))
          this[key] = data[key];
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public init = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        data: null,
        error: 'Method Not Allowed',
      });
      return;
    }

    try {
      let response = await initFolderManager(req, res);

      if (!response.data || response.error)
        throw new Error(response.error ?? 'Missing root Directory / metadata ');

      return res.status(200).json({ data: response.data, error: null });
    } catch (e) {
      return res.status(500).json({ data: null, error: e.message });
    }
  };
  /**
   * {@inheritDoc}
   */
  public list = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        data: null,
        error: 'Method Not Allowed',
      });
      return;
    }
    try {

      let response = await listFolder(req, res);

      if (!response.data || response.error)
        throw new Error(response.error ?? 'Missing Folders / Directories ');

      return res.status(200).json(response)

    } catch (e) {
      return res.status(500).json({ data: null, error: e.message })
    }
  };

  /**
   * {@inheritDoc} TODO: Update with Docs AI
   */
  public create = createDirectory;

  /**
   * {@inheritDoc}
   */
  public delete = deleteFolders;

  /**
   * {@inheritDoc}
   */
  public rename = renameFolder;

  /**
   * {@inheritDoc}
   */
  public copy = copyFolders;

  /**
   * {@inheritDoc}
   */
  public move = moveFolders;

  /**
   * {@inheritDoc}
   */
  public upload = uploadFolder;

  /**
   * {@inheritDoc}
   */
  public index = async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        data: null,
        error: 'Method Not Allowed',
      });
      return;
    }
    try {

      let response = await index(req, res);

      if (!response.data || response.error)
        throw new Error(response.error ?? 'Missing indexed timestamp');

      console.log(response.data)

      return res.status(200).json(response)

    } catch (e) {
      return res.status(500).json({ data: null, error: e.message })
    }
  };
}
