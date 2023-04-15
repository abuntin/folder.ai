import { Directory, Folder } from 'lib/models';
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
   * @returns Root Directory | Error message
   */
  init: NextApiHandler<{ data: Directory | null; error: string | null }>;
  /**
   *
   * @param data with src Folder attribute
   * @returns Payload of Folders and Directories | Error message
   */
  list: NextApiHandler<{
    data: {
      folders: Folder[];
      directories: Directory[];
    } | null;
    error: string | null;
  }>;

  /**
   * Create new Directory TODO: Add metadata hidden file
   *
   * First parameter will be the directory name,
   * second parameter will be the directory path that will be created into.
   */
  create: NextApiHandler<{
    data: { url: string },
    error: string | null
  }>;

  /**
   * Delete Directory | Folder
   * @param Folder to delete
   * @returns Trivial boolean to indicate delete success | Error message
   */
  delete: NextApiHandler<{
    data: boolean | null;
    error: string | null;
  }>;

  /**
   * Rename Directory | Folder
   *
   * The first parameter will be the old path,
   * the second parameter will be the new path.
   */
  rename: NextApiHandler<{
    data: { url: string },
    error: string | null
  }>;

  /**
   * Copy the given Folders to the given destination Directory
   * @returns GStorage url[] of new Folder locations | Error message
   */
  copy: NextApiHandler<{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;

  /**
   * Move the given Folders | Directories to the given destination
   * @param folder Folder to move
   * @param destination Destination Directory
   * @returns GStorage url[] of new Folder locations | Error message
   */
  move: NextApiHandler<{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;

  /**
   * Upload the given Folders into the given Directory
   * @param Folders to upload as formidable.FileList, destination Directory TODO: Expand to user ID
   * @returns S3.PresignedPost[]
   */
  upload: NextApiHandler<{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;
}
