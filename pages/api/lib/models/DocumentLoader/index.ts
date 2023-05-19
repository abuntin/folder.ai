import { BaseDocumentLoader } from 'langchain/document_loaders/base';
import { Document } from 'langchain/dist/document';
import { TextSplitter } from 'langchain/text_splitter';
import { root } from '../firebase';
import { ref, list } from 'firebase/storage';
import pdf from 'pdf-parse';
import { parseOfficeAsync } from 'officeparser';
import { getBytes, getMetadata, StorageReference } from 'firebase/storage';

export interface FirebaseStorageLoaderParams {
  src?: string[];
  bucket?: string;
  firebaseAppConfig?: FirebaseAppConfig;
  maxResults?: number;
}

interface FirebaseAppConfig {}

export class FirebaseStorageLoader extends BaseDocumentLoader {
  private src: string[];

  private bucket: string;

  private firebaseAppConfig: FirebaseAppConfig;

  private maxResults: number = null;

  constructor({
    src = [],
    bucket = '',
    firebaseAppConfig = {},
    maxResults = 100,
  }: FirebaseStorageLoaderParams) {
    super();
    this.src = src;
    this.bucket = bucket;
    this.firebaseAppConfig = firebaseAppConfig;
    this.maxResults = maxResults;
  }

  private _load = async (): Promise<{
    texts: string[];
    metadatas: Record<string, any>[];
  }> =>
    new Promise(async (resolve, reject) => {
      if (!this.src.length || this.bucket == '')
        throw new Error('Missing loader args');

      try {
        let texts: string[] = [];

        let metadatas: Record<string, any>[] = [];

        for (let src of this.src) {
          let srcRef = ref(root, src);

          let listResult = await list(srcRef, {
            maxResults: this.maxResults,
          });

          let { texts: _t, metadatas: _m } = await this.documentFromStorageReference(
            listResult.items
          );

          texts.concat(_t)

          metadatas.concat(_m)
        }

        resolve({ texts, metadatas });
      } catch (e) {
        console.error(e);
        reject(
          e?.message ??
            `Failed to download file ${this.src} from FirebaseStorage bucket ${this.bucket}.`
        );
      }
    });

  public load = async () => {
    try {
      let { texts, metadatas } = await this._load();

      let documents = texts.map((text, i) => ({
        pageContent: text,
        metadata: metadatas[i],
      }));

      return documents;
    } catch (e) {
      throw new Error(
        `FirebaseStorageLoader: ${e?.message ?? 'Unable to load files'}`
      );
    }
  };

  public async loadAndSplit(
    splitter?: TextSplitter
  ): Promise<Document<Record<string, any>>[]> {
    try {
      let { texts, metadatas } = await this._load();

      if (!splitter) throw new Error('No splitter instance provided');

      let documents = splitter.createDocuments(texts, metadatas);

      return documents;
    } catch (e) {
      throw new Error(
        `FirebaseStorageLoader: ${
          e?.message ?? 'Unable to load and split files'
        }`
      );
    }
  }

  public documentFromStorageReference = async (refs: StorageReference[]) => {
    let texts = [] as string[],
      metadatas = [] as Record<string, any>[];

    for (let ref of refs) {
      let _metadata = await getMetadata(ref);
      let type = _metadata.contentType;
      let buffer = await getBytes(ref);
      let { text } = await this.parseDocument(
        { type, buffer },
        pdf,
        parseOfficeAsync
      );

      let metadata = {
        ..._metadata.customMetadata,
        name: ref.name.replace(/\.[^/.]+$/, ''), // name minus file extension
        type,
        directory: this.getParent(ref.fullPath),
        updated: _metadata.updated,
        created: _metadata.timeCreated,
      };

      texts.push(text);
      metadatas.push(metadata);
    }
    return { texts, metadatas };
  };

  public parseDocument = async (
    payload: {
      type: string;
      buffer: Buffer | ArrayBuffer;
    },
    pdfParse,
    parseOfficeAsync
  ): Promise<{ text: string }> =>
    new Promise(async (resolve, reject) => {
      try {
        const { type, buffer: _buffer } = payload;

        let buffer = _buffer instanceof Buffer ? _buffer : Buffer.from(_buffer);

        if (type.includes('image'))
          resolve({ text: '' }); //TODO: Expand with img, video, sound etc
        else if (type.includes('pdf')) {
          let pdfResult = await pdfParse(buffer, {
            max: 10,
          });

          let { text } = pdfResult;

          resolve({ text });
        } else if (type.includes('officedocument')) {
          let text = await parseOfficeAsync(buffer);

          resolve({ text });
        } else if (type === 'text/plain') {
          let text = buffer.toString();

          resolve({ text });
        } else throw new Error('Unknown Mime Type');
      } catch (e) {
        console.error(e);
        reject(e.message);
      }
    });

  public getParentPath = (path: string) => {
    let pathParts = path.split('/');

    if (pathParts.length < 3) return '';

    let lastPart = pathParts[pathParts.length - 2];
    if (lastPart[0] == '.')
      return pathParts.slice(0, pathParts.length - 2).join('/');
    else return pathParts.slice(0, pathParts.length - 1).join('/');
  };
  public getParent = (path: string) => {
    let pathParts = this.getParentPath(path).split('/');
    return pathParts[pathParts.length - 1];
  };
}

async function FirebaseStorageLoaderImports() {
  try {
    const firebaseAppModule = await import('firebase/app')

    const firebaseStorageModule = await import('firebase/storage')

    const pdfParse = await import('pdf-parse');

    const { parseOfficeAsync } = await import('officeparser');

    return { firebaseAppModule, firebaseStorageModule, pdfParse, parseOfficeAsync } as {
      firebaseAppModule: typeof firebaseAppModule;
      firebaseStorageModule: typeof firebaseStorageModule;
      pdfParse: typeof pdfParse;
      parseOfficeAsync: typeof parseOfficeAsync;
    };
  } catch (e) {
    console.error(e);
    throw new Error(
      "Failed to load FirebaseStorage Loader Imports'. Please install it eg. `npm i firebase pdf-parse officeparser`."
    );
  }
}
