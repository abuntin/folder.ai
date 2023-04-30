import { FullMetadata } from 'firebase/storage';
import { PropType } from 'lib/types';

interface FolderAIMetadata {
  type: FullMetadata['contentType'];
  size: FullMetadata['size']
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
   * File full path to user root
   */
  path: string;
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

  static nameFromPath = (str: string, isDirectory = false) => {
    let parts = str.split('/');

    return parts[parts.length - 2] == ''
      ? parts[0]
      : isDirectory
      ? parts[parts.length - 2]
      : parts[parts.length - 1];
  };

  static fromStorageReference = (
    fullMetadata: FullMetadata,
    isDirectory = false
  ) =>
    ({
      name: fullMetadata.name,
      path: fullMetadata.fullPath,
      url: fullMetadata.ref.toString(),
      isDirectory,
      children: [],
      linkedFolders: [],
      metadata: { type: fullMetadata.contentType, size: fullMetadata.size },
      id: fullMetadata.generation,
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
    fullMetadata: FullMetadata,
    isDirectory = true
  ) =>
    ({
      name: fullMetadata.name,
      path: fullMetadata.fullPath,
      url: fullMetadata.ref.toString(),
      isDirectory,
      children: [],
      linkedFolders: [],
      metadata: { type: fullMetadata.contentType, size: fullMetadata.size },
      id: fullMetadata.generation,
    } as Folder);
}