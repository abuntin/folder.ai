import { ref, StorageReference } from 'firebase/storage';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';
import { listFolder } from './list';
import { uploadFolders } from './upload';
import { initFolderManager } from './init';
import { deleteFolders } from './delete';
import { copyFolders } from './copy';
import { moveFolders } from './move';
import { createDirectory } from './create';
import { renameFolder } from './rename'
import { Inngest } from 'inngest';

export class FolderManager implements FolderManagerInterface {
  root: StorageReference;
  inngest: Inngest;

  constructor(data: Partial<FolderManager>, inngest: Inngest, rootPath = '') {
    this.root = ref(root, rootPath);

    this.inngest = inngest;

    let keys = Object.keys(this);

    for (let key of keys) {
      if (Object.prototype.hasOwnProperty.call(data, key))
        this[key] = data[key];
    }
  }

  /**
   * {@inheritdoc}
   */
  public init = initFolderManager;
  /**
   * {@inheritDoc}
   */
  public list = listFolder;

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
  public copy = copyFolders

  /**
   * {@inheritDoc}
   */
  public move = moveFolders

  /**
   * {@inheritDoc}
   */
  public upload = uploadFolders
}
