import { PineconeClient as PineClient } from '@pinecone-database/pinecone';
import { Document } from 'langchain/dist/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores';
import { Directory } from 'lib/models';
import { GCSLoader } from '../models/DocumentLoader';
import { pineconeConfig } from '../models/langchain';
import {
    OAUTH_CLIENT_ID,
    PINECONE_INDEX,
    OAUTH_CLIENT_SECRET, PROJECT_ID, SERVICE_ACCOUNT_DOCAI, STORAGE_BUCKET
} from '../types';

export const indexToPinecone = async (payload: {
  src: Directory;
  files: { name: string; type: string }[];
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, files } = payload;

      let ids = files.map(file => `${src.fullPath}/${file.name}`)

      let {docs} = await getUploadedDocs({ src, files });

      let PineconeClient = new PineClient();

      await PineconeClient.init(pineconeConfig);

      let VectorIndex = PineconeClient.Index(PINECONE_INDEX)

      let VectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        {
          pineconeIndex: VectorIndex,
        }
      );

      await VectorStore.addDocuments(docs, ids)

      resolve(true)
    } catch (e) {
      reject(e?.message ?? 'Unable to index uploads to Pinecone');
    }
  });

export const getUploadedDocs = async (payload: {
  src: Directory;
  files: { name: string; type: string }[];
}): Promise<{ docs: Document[] }> =>
  new Promise(async (resolve, reject) => {
    try {
      const { src, files } = payload;

      const paths = files.map(file => `${src.fullPath}/.pinecone/${file.name}`);

      const loader = new GCSLoader({
        src: paths,
        bucket: STORAGE_BUCKET,
        gcsConfig: {
          projectId: PROJECT_ID,
          credentials: SERVICE_ACCOUNT_DOCAI,
          clientOptions: {
            clientId: OAUTH_CLIENT_ID,
            clientSecret: OAUTH_CLIENT_SECRET,
            scopes: [
              'https://www.googleapis.com/auth/devstorage.read_write',
              'https://www.googleapis.com/auth/cloud-platform',
            ],
          },
        },
      });

      const docs = await loader.load();

      resolve({ docs });
    } catch (e) {
      reject(e.message);
    }
  });
