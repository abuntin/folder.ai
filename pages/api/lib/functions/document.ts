import { PineconeClient as PineClient } from '@pinecone-database/pinecone';
import {
  StorageReference,
  ref,
  listAll,
  getMetadata,
  updateMetadata,
} from 'firebase/storage';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Directory } from 'lib/models';
import { getDocumentId, getDocumentPath } from '.';
import { FirebaseStorageLoader } from '../models/DocumentLoader';
import { chunkOverlap, chunkSize, pineconeConfig } from '../models/langchain';
import { root } from '../models/firebase';
import { PINECONE_INDEX } from '../types';
import { setUserMetadata } from './metadata';
import dayjs from 'dayjs';

export const indexDirectory = async (payload: {
  src: Directory;
  rootRef: StorageReference;
}): Promise<{ indexed: string }> =>
  new Promise(async (resolve, reject) => {
    try {
      const { src, rootRef } = payload;

      let srcRef = ref(root, getDocumentPath({ src, name: '' }));

      let { indexed } = src.metadata;

      let indexTime = indexed
        ? new Date(indexed).getTime()
        : new Date('1970-01-01');

      let listResult = await listAll(srcRef);

      let filtered = await Promise.all(
        listResult.items.map(async item => {
          let _metadata = await getMetadata(item);

          let _created = new Date(_metadata.timeCreated),
            _updated = new Date(_metadata.updated);

          console.log(_created, _updated);

          if (_created.getTime() > indexTime || _updated.getTime() > indexTime)
            return {
              item,
              metadata: _metadata,
            };
          else return null;
        })
      );

      // If doc was updated / created after last index

      let items = filtered.map(val => val.item);

      // Index to Pinecone

      let pineconeResult = await indexToPinecone({
        src,
        refs: items,
      });

      if (!pineconeResult)
        throw new Error('Unable to index changes to pinecone');

      // Update Folder metadatas

      let newIndexed = dayjs(Date.now()).format();

      let folderUpdateResult = await Promise.all(
        filtered.map(async ({ item, metadata }) => {
          let _new = {
            ...metadata,
            customMetadata: {
              ...metadata.customMetadata,
              indexed: newIndexed,
            },
          };

          let _r = await updateMetadata(item, _new);

          return _r.customMetadata.indexed === newIndexed;
        })
      );

      if (folderUpdateResult.includes(false))
        throw new Error('Error updating Folder indexed timestamp');

      console.log('Updated Folder metadatas');

      // Update Directory metadata

      let newMetadata = {
        indexed: newIndexed,
      };

      let updateResult = await setUserMetadata({
        rootRef,
        src,
        metadata: newMetadata,
      });

      if (!updateResult.url)
        throw new Error('Error updating src metadata after indexing');

      console.log('Updated Directory metadata');

      resolve({ indexed: newIndexed });
    } catch (e) {
      reject(e.message + ' : indexDirectory()');
    }
  });

export const deleteFromPinecone = (payload: {
  src: Directory;
  refs: StorageReference[];
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      const { src, refs } = payload;

      let ids = refs.map(ref => getDocumentId({ src, name: ref.name }));

      let PineconeClient = new PineClient();

      await PineconeClient.init(pineconeConfig);

      let VectorIndex = PineconeClient.Index(PINECONE_INDEX);

      await VectorIndex.delete1({
        ids,
        namespace: src.path,
      });

      resolve(true);
    } catch (e) {
      reject(
        e?.message
          ? e.message + ' : deleteFromPinecone()'
          : 'Unable to delete indices from Pinecone'
      );
    }
  });

export const indexToPinecone = async (payload: {
  src: Directory;
  refs: StorageReference[];
}): Promise<true> =>
  new Promise(async (resolve, reject) => {
    try {
      let { src, refs } = payload;

      let loader = new FirebaseStorageLoader({});

      let { texts, metadatas } = await loader.documentFromStorageReference(
        refs
      );

      console.log('Loaded texts, metadatas: indexToPinecone()');

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
      });

      let documents = await splitter.createDocuments(texts, metadatas);

      let { splitTexts, splitMetadatas } = documents.reduce(
        (prev, curr) => {
          let m = curr.metadata;
          delete m['loc'];
          return {
            ...prev,
            splitTexts: prev.splitTexts.concat([curr.pageContent]),
            splitMetadatas: prev.splitMetadatas.concat([m]),
          };
        },
        {
          splitTexts: [] as string[],
          splitMetadatas: [] as Record<string, any>[],
        }
      );

      console.log('Split texts, metadatas: indexToPinecone()');

      let embedder = new HuggingFaceInferenceEmbeddings({
        maxRetries: 1,
        //model: 'bigscience/bloom-1b7'
      });

      // let embedder = new OpenAIEmbeddings({
      //   timeout: 1000,
      //   maxRetries: 1,
      // });

      console.log(embedder);

      let embeds = await embedder.embedDocuments(splitTexts);

      console.log('Embedded texts: indexToPinecone()', embeds);

      let vectors = splitMetadatas.map((metadata, i) => ({
        id: getDocumentId({ src, name: metadata['name'] }),
        values: embeds[i],
        metadata,
      }));

      console.log(
        'Obtained vectors: { id, values, metadata }[]',
        embeds,
        vectors
      );

      let PineconeClient = new PineClient();

      await PineconeClient.init(pineconeConfig);

      let VectorIndex = PineconeClient.Index(PINECONE_INDEX);

      console.log('Obtained vector index : indexToPinecone()');

      resolve(true);

      let upsertResponse = await VectorIndex.upsert({
        upsertRequest: {
          vectors,
          namespace: src.path,
        },
      });

      if (upsertResponse.upsertedCount !== vectors.length)
        throw new Error(
          `Error upserting ${
            vectors.length - upsertResponse.upsertedCount
          } vectors to Pinecone`
        );

      console.log('Upserted to Pinecone');

      resolve(true);
    } catch (e) {
      console.error(e);
      reject(e?.message ? e.message + ' : indexToPinecone()' : '');
    }
  });
