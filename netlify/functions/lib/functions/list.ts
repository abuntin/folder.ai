import {
  ListObjectsCommandInput,
  ListObjectsCommand,
  StorageClass,
} from '@aws-sdk/client-s3';
import { Directory, Folder } from 'lib/models';
import { BUCKET_NAME, s3 } from '../models/s3';

export const list = (
  src: Folder
): Promise<{ folders: Folder[]; directories: Directory[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      let params: ListObjectsCommandInput = {
        Bucket: BUCKET_NAME,
        Prefix: src.path,
      };

      const command = new ListObjectsCommand(params);
      const { Contents } = await s3.send(command);

      if (Contents && Contents.length) {
        let { folders, dirs } = Contents.reduce(
          (prev, curr) => {
            if (curr.Key == src.path) return { ...prev };
            else {
              let srcParts = src.path.split('/');

              let parts = curr.Key.split('/');

              let newDir;

              if (parts.length > srcParts.length) {
                let dirName = `${parts[parts.length - srcParts.length]}/`;

                let dirPath = `${parts
                  .slice(0, parts.length - srcParts.length + 1)
                  .join('/')}/`;

                if (prev.dirs[dirName]) {
                  let { ContentLength, LastModified, path } =
                    prev.dirs[dirName];

                  let newModified =
                    curr.LastModified.getTime() - LastModified.getTime() > 0
                      ? curr.LastModified
                      : LastModified;

                  newDir = {
                    ...prev.dirs[dirName],
                    ContentLength: ContentLength + curr.Size,
                    LastModified: newModified,
                    path,
                  };
                } else {
                  newDir = {
                    ContentLength: curr.Size,
                    LastModified: curr.LastModified,
                    path: dirPath,
                    StorageClass: curr.StorageClass as StorageClass,
                    ETag: curr.ETag,
                    $metadata: {},
                  };
                }

                return { ...prev, dirs: { ...prev.dirs, [dirName]: newDir } };
              } else {
                let folder = Folder.fromAWS(
                  {
                    ContentLength: curr.Size,
                    StorageClass: curr.StorageClass,
                    LastModified: curr.LastModified,
                    ETag: curr.ETag,
                    $metadata: {},
                  },
                  curr
                );

                return { ...prev, folders: prev.folders.concat([folder]) };
              }
            }
          },

          {
            folders: [] as Folder[],
            dirs: {} as {
              [key: string]: {
                ContentLength: number;
                StorageClass: StorageClass;
                LastModified: Date;
                ETag: string;
                $metadata: {};
                path: string;
              };
            },
          }
        );

        let directories = [] as Directory[];

        for (let [dirName, dirMetadata] of Object.entries(dirs)) {
          let directory = Directory.fromAWS(
            {
              ContentLength: dirMetadata.ContentLength,
              StorageClass: dirMetadata.StorageClass,
              LastModified: dirMetadata.LastModified,
              ETag: dirMetadata.ETag,
              $metadata: dirMetadata['$metadata'],
            },
            null,
            dirName,
            dirMetadata.path
          );

          directories = directories.concat([directory]);
        }

        resolve({ folders, directories });
      } else resolve({ folders: [], directories: [] });
    } catch (e) {
      reject(e.message);
    }
  });
