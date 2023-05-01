import { ref } from 'firebase/storage';
import fs_extra from 'fs-extra';
import { Folder } from 'lib/models';
import { PropType } from 'lib/types';
import { uniqueId } from 'lodash';
import { inngest } from 'pages/api/inngest';
import { parseForm, upload } from '../../functions';
import { processDocumentType } from '../../functions/documentai';
import {
  FolderManagerInterface,
  typeToPath,
  ValidFileTypes,
} from '../../types';
import { root } from '../firebase';

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

    let documents = new Set<Folder['metadata']['type']>();

    for (let file of files) {
      let buffer = await fs_extra.readFile(file.filepath);

      let type = file.mimetype;

      let uploadPrefix = ValidFileTypes.has(type)
        ? `.documentai/${typeToPath(type)}/`
        : '';

      let destinationRef = ref(
        root,
        `${directory.path}/${uploadPrefix}${file.originalFilename}`
      );

      const metadata = {
        name: file.originalFilename,
        size: file.size,
        contentType: type,
      };

      let url = await upload(buffer, metadata, destinationRef);

      urls.push(url);

      // Only process successful uploads

      let isDoc = ValidFileTypes.has(type)

      if (isDoc) {
        console.log(isDoc)
        documents.add(type);
      }
    }

    if (urls.length === files.length) {
      console.log(`Uploaded ${files.length} Folders to ${directory.name}`);

      try {
        let _srcRef = ref(root, `${directory.path}/.documentai`);

        let _outputRef = ref(root, `${directory.path}/.folderai`);

        let types = Array.from(documents)

        for (let type of types) {
          let _typeres = await processDocumentType({
            type,
            src: _srcRef,
            dest: _outputRef,
          });
        }
      } catch (e) {
        console.error(e.message)
        throw new Error(e.message);
      }

      // await inngest.send({
      //   id: `documentai/on.upload/${uniqueId()}`,
      //   name: 'documentai/on.upload',
      //   data: {
      //     payload: {
      //       documents: Array.from(documents),
      //       directory
      //     }
      //   }
      // })

      return res.status(200).json({ data: { urls }, error: null }); // Send response back to UI
    } else
      return res
        .status(500)
        .json({ data: null, error: 'Error uploading files' });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ data: null, error: e.message ?? 'Error uploading files' });
  }
};
