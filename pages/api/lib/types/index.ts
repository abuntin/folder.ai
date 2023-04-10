import { Folder } from 'lib/models';
import { NextApiHandler } from 'next';

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}
export interface FolderManagerInterface {
  /**
   *
   * @param data with no attributes for now TODO: Add User ID
   * @returns root Folder
   */
  init: NextApiHandler<{ data: Folder | null; error: string | null }>; 
  /**
   *
   * @param data with src Folder attribute
   * @returns Payload of Folders and Directories | Error
   */
  list: NextApiHandler<{
    data: {
      folders: Folder[];
      directories: Folder[];
    } | null;
    error: string | null;
  }>;

  /**
   * Create new directory
   *
   * First parameter will be the directory name,
   * second parameter will be the directory path that will be created into.
   */
  createDirectory: () => void;

  /**
   * Delete directories/folders
   */
  delete: () => void;

  /**
   * Rename directory | folder
   *
   * The first parameter will be the old path,
   * the second parameter will be the new path.
   */
  rename: () => void;

  /**
   * Copy the given Folders/Directories to the given destination
   */
  copy: () => void;

  /**
   * Move the given Folders/Directories to the given destination
   */
  move: () => void;

  /**
   * Upload the given Folders into the given directory path
   * @param Folders to upload as formidable.FileList, destination Folder TODO: Expand to user ID
   * @returns GStorage url[]
   */
  upload: NextApiHandler<{
    data: {
      url: string | string[];
    } | null;
    error: string | null;
  }>;
}
