import { FullMetadata } from 'firebase/storage';
import { PropType } from 'lib/types';

interface FolderAIMetadata {
  type: FullMetadata['contentType'];
  size: FullMetadata['size'];
  json: string;
}

export class Folder {
  /**
   * File id
   */
  id: string;
  /**
   * File Name
   */
  name: string;
  /**
   * FolderAI path to user root
   */
  path: string;
  /**
   * Fullpath (including wrapper folders '.documentai' '.folderai' )
   */
  fullPath: string;
  /**
   * Linked folders
   * This should be present even with empty array
   */
  linkedFolders: Folder[];

  /**
   * Children
   * This should be present even with empty array
   */
  children: Folder[];

  /**
   * Is directory
   */
  isDirectory: boolean;

  /**
   * GStorage URL
   */

  url?: string;

  /**
   * FolderAI + GCS Metadata
   */

  metadata?: FolderAIMetadata = null;

  constructor(data: any) {
    const keys = Object.keys(this);

    for (const key of keys) {
      let val: any = null;

      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (data[key] == null)
          throw new Error(`Null/undefined in file constructor ${key}`);
        else val = data[key];
      }

      this[key] = val;
    }
  }

  static pathFromFullPath = (path: string) =>
    path.replace(/.documentai\/.*\//g, '');


  static getParentPath = (src: Folder) => {
    let pathParts = src.path.split('/')
    return pathParts.slice(0, pathParts.length - 1).join('/')
  }

  static fromStorageReference = (
    metadata: { fullMetadata: FullMetadata, metadata: string },
    isDirectory = false
  ) =>
    ({
      name: metadata.fullMetadata.name,
      path: this.pathFromFullPath(metadata.fullMetadata.fullPath),
      fullPath: metadata.fullMetadata.fullPath,
      url: metadata.fullMetadata.ref.toString(),
      isDirectory,
      children: [],
      linkedFolders: [],
      metadata: { type: metadata.fullMetadata.contentType, size: metadata.fullMetadata.size, json: metadata.metadata },
      id: metadata.fullMetadata.generation,
    } as Folder);
}

export class Directory extends Folder {
  isDirectory: boolean;

  constructor(data: any) {
    super(data);

    const keys = Object.keys(this);

    for (const key of keys) {
      let val: any = null;

      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (data[key] == null)
          throw new Error(`Null/undefined in file constructor ${key}`);
        else {
          if (key == 'isDirectory' && data[key] == false)
            throw new Error('Property isDirectory must be true');
          val = data[key];
        }
      }

      this[key] = val;
    }
  }

  static fromStorageReference = (
    metadata: { fullMetadata: FullMetadata, metadata: string },
    isDirectory = true
  ) =>
    ({
      name: metadata.fullMetadata.name,
      path: this.pathFromFullPath(metadata.fullMetadata.fullPath),
      fullPath: metadata.fullMetadata.fullPath,
      url: metadata.fullMetadata.ref.toString(),
      isDirectory,
      children: [],
      linkedFolders: [],
      metadata: { type: metadata.fullMetadata.contentType, size: metadata.fullMetadata.size, json: metadata.metadata },
      id: metadata.fullMetadata.generation,
    } as Folder);
}
