import { PropType } from 'lib/types';
import {
  generateV4UploadSignedUrl
} from '../../functions';
import {
  FolderManagerInterface
} from '../../types';

export const uploadFolder: PropType<FolderManagerInterface, 'upload'> = async (
  req,
  res
) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      data: null,
      error: 'Method Not Allowed',
    });
    return;
  }

  console.log('Initialised FolderManager.upload()');

  try {
    const { files: inputFiles, directory, type } = JSON.parse(req.body);

    console.log(inputFiles, directory)

    if (!type || type !== 'upload')
      return res
        .status(405)
        .json({ data: null, error: 'Invalid NextApiRequest type' });

    if (!Object.prototype.hasOwnProperty.call(directory, 'path'))
      return res
        .status(400)
        .json({ data: null, error: "Invalid directory: Missing 'path'" });

    if (!directory.isDirectory)
      res.status(400).json({ data: null, error: 'Called upload on Folder' });

    let urls = {} as { [name: string]: string };

    let entries = Object.entries(inputFiles as { [name: string]: string })

    for (let [name, type] of entries) {
      let presignedResult = await generateV4UploadSignedUrl({
        name,
        type,
        directory,
      });

      if (presignedResult.url) urls = { ...urls, [name]: presignedResult.url }

      else throw new Error(`Unable to obtain presigned url for ${name}`);
    }

    if (Object.keys(urls).length == entries.length) {
      console.log(
        `Created presigned URLs for ${entries.length} Folders in ${directory.name}`
      );

      return res.status(200).json({ data: { urls }, error: null });
    } else
      return res
        .status(500)
        .json({ data: null, error: 'Error uploading files' });
  } catch (e) {
    return res.status(500).json({
      data: null,
      error: e?.message ?? 'Unable to generate presigned POST urls',
    });
  }
};

// export const uploadFolders: PropType<FolderManagerInterface, 'upload'> = async (
//   req,
//   res
// ) => {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', 'POST');
//     res.status(405).json({
//       data: null,
//       error: 'Method Not Allowed',
//     });
//     return;
//   }

//   console.log('Initialised FolderManager.upload()');

//   try {
//     const { fields, files: formidableFiles, directory } = await parseForm(req);

//     const _files = formidableFiles.media;
//     const files = Array.isArray(_files) ? _files : [_files];

//     let filePaths = Array.isArray(_files)
//       ? files.map(f => f.filepath)
//       : [_files.filepath];

//     let urls = [] as string[];

//     //let documents = new Set<Folder['metadata']['type']>();

//     let documents = {} as {
//       [k: Folder['metadata']['type']]: StorageReference[];
//     };

//     for (let file of files) {
//       let buffer = await fs_extra.readFile(file.filepath);

//       let type = file.mimetype;

//       let uploadPrefix = ValidFileTypes.has(type) ? `.documentai/` : '';

//       let destinationRef = ref(
//         root,
//         `${directory.path}/${uploadPrefix}${file.originalFilename}`
//       );

//       const metadata = {
//         name: file.originalFilename,
//         size: file.size,
//         contentType: type,
//       };

//       let result = await upload(buffer, metadata, destinationRef);

//       if (result.url) urls.push(result.url);

//       // Only process successful uploads

//       let isDoc = ValidFileTypes.has(type);

//       if (isDoc) {
//         console.log(isDoc);
//         let typeList = documents[type] ?? null;
//         documents = {
//           ...documents,
//           [type]: typeList
//             ? typeList.concat([destinationRef])
//             : [destinationRef],
//         };
//       }
//     }

//     if (urls.length === files.length) {
//       console.log(`Uploaded ${files.length} Folders to ${directory.name}`);

//       try {
//         let processResult = await processDocuments({ documents, directory });

//         if (processResult) {
//           console.log('DocumentAI Processing Result', processResult);

//           let moveMetadataResult = processDirectoryNewUpload({
//             src: directory,
//           });

//           if (moveMetadataResult)
//             return res.status(200).json({
//               data: { files: null }, //data: { urls },
//               error: null,
//             });
//           // Send response back to UI
//           else throw new Error('Error moving metadata: FolderManager.upload');
//         }
//       } catch (e) {
//         console.error(e.message);
//         throw new Error(e.message);
//       }

//       // await inngest.send({
//       //   id: `documentai/on.upload/${uniqueId()}`,
//       //   name: 'documentai/on.upload',
//       //   data: {
//       //     payload: {
//       //       documents: Array.from(documents),
//       //       directory
//       //     }
//       //   }
//       // })
//     } else
//       return res
//         .status(500)
//         .json({ data: null, error: 'Error uploading files' });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ data: null, error: e.message ?? 'Error uploading files' });
//   }
// };
