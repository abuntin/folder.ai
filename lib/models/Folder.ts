import { FullMetadata, StorageReference } from 'firebase/storage';
import short from 'short-uuid';
import { PropType } from 'lib/types';

interface FolderMetadata {
  type?: FullMetadata['contentType'];
  size?: FullMetadata['size'];
  created: string | null;
  updated: string | null;
  indexed: string | null;
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

  metadata: FolderMetadata = null;

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
    let pathParts = src.fullPath.split('/');

    if (pathParts.length < 3) return '';

    let lastPart = pathParts[pathParts.length - 2];
    if (lastPart[0] == '.')
      return pathParts.slice(0, pathParts.length - 2).join('/');
    else return pathParts.slice(0, pathParts.length - 1).join('/');
  };

  static fromGStorageMetadata = (payload: {
    metadata: FullMetadata,
    isDirectory: boolean
  }) => {
    const { metadata, isDirectory = false } = payload;

    let result = {
      name: metadata.name,
      path: this.pathFromFullPath(metadata.fullPath),
      fullPath: metadata.fullPath,
      url: metadata.ref.toString(),
      isDirectory,
      children: [],
      linkedFolders: [],
      metadata: {
        type: metadata.contentType,
        size: metadata.size,
        created: metadata.timeCreated,
        updated: metadata.updated,
        indexed: metadata.customMetadata?.indexed ?? null,
      },
      id: metadata.generation,
    };
    return isDirectory ? (result as Directory) : (result as Folder);
  };
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

  static fromStorageReference = (payload: {
    reference: StorageReference;
    id?: string;
    metadata?: typeof this.metadata
  }) =>
    ({
      name: payload.reference.name,
      fullPath: payload.reference.fullPath,
      path: Folder.pathFromFullPath(payload.reference.fullPath),
      isDirectory: true,
      metadata: payload.metadata ?? {},
      id: payload.id ?? short.generate(),
      url: payload.reference.toString(),
      linkedFolders: [],
      children: [],
    } as Directory);
}


export type FolderAIMetadata = {
  [directory: string]: PropType<Directory, 'metadata'>
}