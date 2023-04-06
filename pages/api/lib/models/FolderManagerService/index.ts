import { ref, StorageReference } from "firebase/storage";
import { FolderManagerServiceInterface } from "../../types";
import { root } from "../firebase";
import { listFolder } from "./list";
import { uploadFolder } from "./upload";
import { initFolderService } from './init'

export class FolderManagerService implements FolderManagerServiceInterface {
  root: StorageReference;

  constructor(rootPath = "") {
    this.root = ref(root, rootPath);
  }

  /**
   * {@inheritdoc}
   */
  public init = initFolderService;
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
