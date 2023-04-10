import { ref, StorageReference } from 'firebase/storage';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';
import { listFolder } from './list';
import { uploadFolder } from './upload';
import { initFolderManager } from './init';

export class FolderManager implements FolderManagerInterface {
  root: StorageReference;

  constructor(data: Partial<FolderManager>, rootPath = '') {
    this.root = ref(root, rootPath);

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
   * {@inheritDoc}
   */
  public createDirectory = () => {};

  /**
   * {@inheritDoc}
   */
  public delete = () => {};

  /**
   * {@inheritDoc}
   */
  public rename = () => {};

  /**
   * {@inheritDoc}
   */
  public copy = () => {};

  /**
   * {@inheritDoc}
   */
  public move = () => {};

  /**
   * {@inheritDoc}
   */
  public upload = uploadFolder;
}
