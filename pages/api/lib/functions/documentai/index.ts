import { protos } from '@google-cloud/documentai';
import { ref, listAll, StorageReference } from 'firebase/storage';
import { Directory, Folder } from 'lib/models';
import { typeToPath } from '../../types';
import { DefaultProcessor, DocAIClient } from '../../models/documentai';
import { root } from '../../models/firebase';

export const processDirectory = async (payload: {
  directory: Directory;
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      let { directory } = payload;

      const _srcRef = ref(root, `${directory.path}`);

      const srcRef = ref(_srcRef, `/.documentai`); // folder containing documents sorted by mimetype

      let mimeFoldersRef = await listAll(srcRef);

      let documents = mimeFoldersRef.prefixes.map(
        mimetypeRef =>
          ({
            gcsUri: mimetypeRef.toString(),
            mimeType: mimetypeRef.name,
          } as protos.google.cloud.documentai.v1.IGcsDocument)
      );

      const outputRef = ref(_srcRef, `/.folderai`);

      const request: protos.google.cloud.documentai.v1.IBatchProcessRequest = {
        name: DefaultProcessor,
        inputDocuments: {
          gcsDocuments: {
            documents,
          },
        },
        documentOutputConfig: {
          gcsOutputConfig: {
            gcsUri: outputRef.toString(),
          },
        },
      };

      const [operation] = await DocAIClient.batchProcessDocuments(request);

      let [response, metadata, originalOperation] = await operation.promise();

      if (metadata.state == 'SUCCEEDED') resolve(true);
    } catch (e) {
      reject(e.message);
    }
  });

export const processDocumentType = (payload: {
  type: Folder['metadata']['type'];
  src: StorageReference;
  dest: StorageReference;
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      let { type, src, dest } = payload;

      let path = typeToPath(type);

      let srcRef = ref(src, `/${path}`);

      let outputRef = ref(dest, `/${path}`);

      let inputDocuments = [
        {
          gcsUri: srcRef.toString(),
          mimeType: type,
        } as protos.google.cloud.documentai.v1.IGcsDocument,
      ];

      const request: protos.google.cloud.documentai.v1.IBatchProcessRequest = {
        name: DefaultProcessor,
        inputDocuments: {
          gcsPrefix: {
            gcsUriPrefix: srcRef.toString(),
          },
        },
        documentOutputConfig: {
          gcsOutputConfig: {
            gcsUri: outputRef.toString(),
            fieldMask: {
                paths: ['text', 'mimetype', 'shrdInfo', 'pages.formFields', 'error']
            }
          },
        },
        skipHumanReview: true,
      };

      console.log('request', request);

      await DocAIClient.initialize();

      const [operation] = await DocAIClient.batchProcessDocuments(request);

      console.log('operation', operation);

      let [response, metadata, originaloperation] = await operation.promise();

      console.log('metadata', metadata);

      if (metadata.state != 'FAILED') resolve(true);
    } catch (e) {
        console.log(e.message)
        reject(e.message);
    }
  });

export const getDocument = (payload: {
  content: string; //base64 string
  type: Folder['metadata']['type'];
}): Promise<{ document: protos.google.cloud.documentai.v1.IDocument }> =>
  new Promise(async (resolve, reject) => {
    try {
      let { content, type: mimeType } = payload;
      if (!content || !mimeType) {
        reject('Missing Buffer or Folder reference');
      }

      let request: protos.google.cloud.documentai.v1.IProcessRequest = {
        name: DefaultProcessor,
        rawDocument: {
          content,
          mimeType,
        },
      };

      const [response, originalRequest] = await DocAIClient.processDocument(
        request
      );

      const { document } = response;

      resolve({ document });
    } catch (e) {
      reject(e.message + ' docai');
    }
  });
