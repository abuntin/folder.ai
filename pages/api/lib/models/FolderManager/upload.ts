import { root } from '../firebase';
import fs_extra from 'fs-extra';
import {
  uploadBytesResumable,
  ref,
  getDownloadURL,
  UploadTask,
} from 'firebase/storage';
import { Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { File, FolderManagerInterface } from '../../types';
import { parseForm } from '../../functions';
import { toArrayBuffer } from 'lib/functions';

//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   const promise = new Promise((resolve, reject) => {
//     try {
//       const uploadDir = path.join(__dirname, 'public', 'files');

//       let form = new IncomingForm({
//         maxFiles: 1,
//         uploadDir,
//         keepExtensions: true,
//       });

//       console.log(form);

//       form.parse(req, async (err, fields: Fields, files: Files) => {
//         try {
//           console.log(
//             'Form parse FolderManager.upload()',
//             fields,
//             files,
//             req.body
//           );

//           let { folder: _folder } = fields;

//           let callback = checkErrors(res, { err, fields, files });

//           if (isFunction(callback)) return callback();

//           let { file, folder } = callback;

//           let destinationRef = ref(root, `${folder.path}/`);

//           if (!isArray(file)) {
//             let uploadData = await fs_extra.readFile(file.newFilename);

//             const uploadTask = uploadBytesResumable(
//               destinationRef,
//               uploadData
//             ) as UploadTask;

//             let unsubscribe = uploadTask.on(
//               'state_changed',
//               // update progress
//               async snapshot => {
//                 const percent = Math.round(
//                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                 );
//               },
//               err => {
//                 unsubscribe(); // kill upload
//                 throw err;
//               },
//               async () => {
//                 // download url
//                 let url = await getDownloadURL(uploadTask.snapshot.ref);

//                 resolve({ url });
//               }
//             );
//           } else reject('Only one file allowed');
//         } catch (e) {
//           console.log(e);
//           reject(e.message);
//         }
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e.message);
//     }
//   });

//   return promise
//     .then(payload => res.status(200).json({ payload }))
//     .catch(e => res.status(400).json({ error: new Error(e) }));
// };
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

  try {
    const { fields, files: formidableFiles, folder } = await parseForm(req);

    const _files = formidableFiles.media;
    const files = Array.isArray(_files) ? _files : [_files]
    let filePaths = Array.isArray(_files)
      ? files.map(f => f.filepath)
      : [_files.filepath];

    let urls = [];

    for (let file of files) {
      let buffer = await fs_extra.readFile(file.filepath)

      let destinationRef = ref(root, `${folder.path}/${file.originalFilename}`);

      const metadata = {
        name: file.originalFilename,
        size: file.size,
        contentType: file.mimetype,
      };

      const uploadTask = uploadBytesResumable(
        destinationRef,
        new Uint8Array(buffer),
        metadata
      ) as UploadTask;

      let unsubscribe = uploadTask.on(
        'state_changed',
        // update progress
        async snapshot => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(percent)

        },
        err => {
          console.error(err, 'here');
          unsubscribe(); // kill upload
        },
        async () => {
          // download url
          let url = await getDownloadURL(uploadTask.snapshot.ref);

          urls.push(url);
        }
      );
    }

    res.status(200).json({
      data: {
        url: urls,
      },
      error: null,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ data: null, error: e.message ?? 'Error uploading file' });
  }
};
