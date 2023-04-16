import { HandlerContext, HandlerEvent } from '@netlify/functions';
import { ref, UploadMetadata } from 'firebase/storage';
import fs_extra from 'fs-extra';
import { PropType } from 'lib/types';
import {
  netlifyResponse,
  parseForm,
  parseMultipartForm,
  upload,
  uploadS3,
} from '../../functions';
import { FolderManagerInterface } from '../../types';
import { root } from '../firebase';

export const uploadFolders: PropType<FolderManagerInterface, 'upload'> = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== 'POST') {
    return netlifyResponse(200, {
      data: null,
      error: 'Method Not Allowed',
    });
  }

  console.log('Initialised FolderManager.upload()');

  try {
    const { fields, files, directory } = await parseMultipartForm(event);

    console.log('files', files);

    let urls = [] as string[];

    for (let [filename, { type, encoding, content }] of Object.entries(files)) {
      let destinationRef = ref(root, `${directory.path}/${filename}`);

      // let fileObj = {
      //   name: file.originalFilename,
      //   type: file.mimetype,
      //   body: buffer,
      // };

      const metadata: UploadMetadata = {
        contentEncoding: encoding,
        contentType: type,
      };

      let url = await upload(content, metadata, destinationRef); //await uploadS3(metadata, directory);

      urls.push(url);
    }

    if (urls.length === Object.keys(files).length) {
      console.log(`Uploaded ${files.length} Folders to ${directory.name}`);
      return netlifyResponse(200, { data: { urls }, error: null });
    } else throw new Error('Unable to upload some files ');
  } catch (e) {
    console.error(e);
    return netlifyResponse(500, {
      data: null,
      error: e.message ?? 'Error uploading files',
    });
  }
};

// export const uploadFolders: PropType<FolderManagerInterface, 'upload'> = async (
//   event: HandlerEvent,
//   context: HandlerContext
// ) => {
//   if (event.httpMethod !== 'POST') {
//     return netlifyResponse(405, {
//       data: null,
//       error: 'Method Not Allowed',
//     })
//   }

//   console.log('Initialised FolderManager.upload()');

//   try {
//     const { fields, files: formidableFiles, directory } = await parseForm(req);

//     const _files = formidableFiles.media;
//     const files = Array.isArray(_files) ? _files : [_files];

//     console.log('formidablefiles', files);
//     let filePaths = Array.isArray(_files)
//       ? files.map(f => f.filepath)
//       : [_files.filepath];

//     let urls = [] as string[];

//     for (let file of files) {
//       let buffer = await fs_extra.readFile(file.filepath);

//       let destinationRef = ref(
//         root,
//         `${directory.path}/${file.originalFilename}`
//       );

//       // let fileObj = {
//       //   name: file.originalFilename,
//       //   type: file.mimetype,
//       //   body: buffer,
//       // };

//       const metadata = {
//         name: file.originalFilename,
//         size: file.size,
//         contentType: file.mimetype,
//       };

//       let url = await upload(buffer, metadata, destinationRef); //await uploadS3(metadata, directory);

//       urls.push(url);
//     }

//     if (urls.length === files.length) {
//       console.log(`Uploaded ${files.length} Folders to ${directory.name}`);
//       return res.status(200).json({ data: { urls }, error: null });
//     } else throw new Error('Unable to upload some files ');
//   } catch (e) {
//     console.error(e);
//     res
//       .status(500)
//       .json({ data: null, error: e.message ?? 'Error uploading files' });
//   }
// };

// export const uploadFolder: PropType<FolderManagerInterface, 'upload'> = async (
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
//     let { files, directory } = JSON.parse(event.body);

//     if (!files || !files.length)
//       return res
//         .status(405)
//         .json({ data: null, error: 'Missing file att list ' });

//     let s3Response = await uploadS3(files, directory);

//     if (s3Response.data && s3Response.data.length == files.length)
//       return res
//         .status(200)
//         .json({ data: { files: s3Response.data }, error: null });

//     else throw new Error('Unable to obtain S3 Metadata for upload')
//   } catch (e) {
//     res.status(500).json({ data: null, error: e.message });
//   }
// };
