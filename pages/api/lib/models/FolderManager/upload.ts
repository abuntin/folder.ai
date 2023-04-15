import fs_extra from 'fs-extra';
import { PropType } from 'lib/types';
import { parseForm, uploadS3 } from '../../functions';
import { FolderManagerInterface } from '../../types';

export const uploadFolders: PropType<FolderManagerInterface, 'upload'> = async (
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
    const { fields, files: formidableFiles, directory } = await parseForm(req);

    const _files = formidableFiles.media;
    const files = Array.isArray(_files) ? _files : [_files];
    let filePaths = Array.isArray(_files)
      ? files.map(f => f.filepath)
      : [_files.filepath];

    let urls = [] as string[];

    for (let file of files) {
      let buffer = await fs_extra.readFile(file.filepath);

      let fileObj = {
        name: file.originalFilename,
        type: file.mimetype,
        body: buffer,
      };

      let etag = await uploadS3(fileObj, directory);

      urls.push(etag);
    }

    if (urls.length === files.length)
      return res.status(200).json({ data: { urls }, error: null });
    else throw new Error('Unable to upload some files ');
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ data: null, error: e.message ?? 'Error uploading files' });
  }
};

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
//     let { files, directory } = req.body;

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
