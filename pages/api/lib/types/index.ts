import { Folder } from "lib/models";
import { NextApiRequest, NextApiResponse } from "next";

export type FolderManagerRequest = NextApiRequest & {
  body: { type: "upload" | "list", [k:string]: any }
};

export type FolderManagerResponse = NextApiResponse & {

}

export type FolderManagerHandler = (req: FolderManagerRequest, res: FolderManagerResponse) => Promise<void>

export interface FolderManagerServiceInterface {

  /** 
   * 
   * @param data with no attributes for now TODO: Add User ID
   * @returns path to root folder TODO: Expand init return vals
  */
  init: (data: any) => Promise<{ rootFolder: Folder } | Error>
  /**
   *
   * @param data with src Folder attribute
   * @returns Payload of Folders and Directories | Error
   */
  list: (data: any) => Promise<{ folders: Folder[], directories: Folder[] } | Error>;

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
   * Copy the given folders/directories to the given destination
   */
  copy: () => void;

  /**
   * Move the given folders/directories to the given destination
   */
  move: () => void;

  /**
   * Upload the given folders into the given directory path
   * @param data
   * @returns GStorage url 
   */
  upload: (data: any) => Promise<{ url: string } | Error>;
}
