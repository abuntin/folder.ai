import { root } from '../firebase';
import { s3, BUCKET_NAME } from '../s3';
import { getMetadata, listAll } from 'firebase/storage';
import { PropType } from 'lib/types';
import { Directory, Folder } from 'lib/models';
import { FolderManagerInterface } from '../../types';
import { ListObjectsCommandInput, ListObjectsCommand } from '@aws-sdk/client-s3'


// export const initFolderManager: PropType<FolderManagerInterface, 'init'> = async (req, res) => {

//   try {
//     console.log('Initialised FolderManager.init()')

//     let params: ListObjectsCommandInput = {
//       Bucket: BUCKET_NAME,
//     };

//     const command = new ListObjectsCommand(params);
//     const { Contents } = await s3.send(command);

//     let directories = Contents.filter(obj => obj.Key.includes('/', obj.Key.length - 1))

//     let root = directories[0]

//     let rootDirectory = {
//       name: root.Key,
//       path: root.Key,
//       isDirectory: true,
//       id: root.ETag,
//       metadata: {
//         ObjectSize: root.Size,
//         StorageClass: root.StorageClass,
//         LastModified: root.LastModified,
//         ETag: root.ETag,
//         '$metadata': {}
//       },
//       linkedFolders: [],
//       children: [] 
//     } as Directory

//     console.log('Obtained root Directory', rootDirectory)

//   return res.status(200).json({ data: rootDirectory, error: null })

//   } catch (e) {
//     console.error(e)

//     return res.status(500).json({ data: null, error: e.message })
//   }
// }

export const initFolderManager: PropType<
  FolderManagerInterface,
  'init'
> = async (req, res) => {
  try {
    console.log('Initialised FolderManager.init()');

    let listRes = await listAll(root);

    let ref = listRes.prefixes[0];

    let rootDirectory = {
      name: ref.name,
      path: ref.fullPath,
      isDirectory: true,
      id: 'rootID',
      url: ref.toString(),
    } as Directory;

    console.log('Obtained root folder');

    return res.status(200).json({ data: rootDirectory, error: null });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ data: null, error: 'Unable to fetch root folder' });
  }
};
