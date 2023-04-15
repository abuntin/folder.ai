import { GetObjectCommandOutput, _Object as S3Object } from '@aws-sdk/client-s3'
import { Troubleshoot } from '@mui/icons-material';

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
   * Folder.AI + Google Cloud storage metadata
   */
  metadata: GetObjectCommandOutput = null;

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
    let parts = str.split('/')

    return parts[parts.length - 2] == '' ? parts[0] : isDirectory ? parts[parts.length - 2] : parts[parts.length - 1] 
  }

  static fromAWS = (
    metadata: GetObjectCommandOutput,
    object: S3Object,
    name: string = null,
    path: string = null
  ) =>
    ({
      name: name ?? Folder.nameFromPath(object.Key),
      path: path ?? object.Key,
      isDirectory: false,
      children: [],
      linkedFolders: [],
      metadata,
      id: object.ETag,
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
            if (key == 'isDirectory' && data[key] == false) throw new Error('Property isDirectory must be true')
          val = data[key];
        }
      }

      this[key] = val;
    }

    
  }

  static fromAWS = (
    metadata: GetObjectCommandOutput,
    object: S3Object = null,
    name: string,
    path: string,
  ) =>
    ({
      name,
      path,
      isDirectory: true,
      children: [],
      linkedFolders: [],
      metadata,
      id: metadata.ETag,
    } as Directory);
}
