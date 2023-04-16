import { Directory, Folder } from 'lib/models';
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export interface FolderManagerInterface {
  /**
   *
   * @param data with no attributes for now TODO: Add User ID
   * @returns Root Directory | Error message
   * <{ data: Directory | null; error: string | null }>
   */
  init: Handler;
  /**
   *
   * @param data with src Folder attribute
   * @returns Payload of Folders and Directories | Error message
   * <{
    data: {
      folders: Folder[];
      directories: Directory[];
    } | null;
    error: string | null;
  }>
   */
  list: Handler;

  /**
   * Create new Directory TODO: Add metadata hidden file
   *
   * First parameter will be the directory name,
   * second parameter will be the directory path that will be created into.
   * @returns url of new Directory
   * <{
    data: { url: string },
    error: string | null
  }>
   */
  create: Handler;

  /**
   * Delete Directory | Folder
   * @param Folder to delete
   * @returns Trivial boolean to indicate delete success | Error message
   * <{ data: boolean | null; error: string | null; }>
   */
  delete: Handler;

  /**
   * Rename Directory | Folder
   *
   * The first parameter will be the old path,
   * the second parameter will be the new path.
   * @returns url of new Folder
   * <{
    data: { url: string },
    error: string | null
  }>
   */
  rename: Handler;

  /**
   * Copy the given Folders to the given destination Directory
   * @returns GStorage url[] of new Folder locations | Error message
   * <{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;
   */
  copy: Handler

  /**
   * Move the given Folders | Directories to the given destination
   * @param folder Folder to move
   * @param destination Destination Directory
   * @returns GStorage url[] of new Folder locations | Error message
   * <{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;
   */
  move: Handler

  /**
   * Upload the given Folders into the given Directory
   * @param Folders to upload as formidable.FileList, destination Directory TODO: Expand to user ID
   * @returns <{
    data: {
      urls: string[];
    } | null;
    error: string | null;
  }>;
   */
  upload: Handler
}
