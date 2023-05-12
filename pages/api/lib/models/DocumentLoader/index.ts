import { BaseDocumentLoader } from 'langchain/document_loaders';
import { Document } from 'langchain/dist/document';
import { TextSplitter } from 'langchain/text_splitter';

export interface GCSLoaderParams {
  bucket: string;
  src: string | string[];
  gcsConfig?: GCSConfig;
  isDirectory?: boolean;
}

interface GCSConfig {
  projectId?: string;
  credentials?: Record<string, any>;
  clientOptions?: {
    clientId: string;
    clientSecret: string;
    scopes: string[];
  };
}

export class GCSLoader extends BaseDocumentLoader {
  private bucket: string;

  private src: string | string[];

  private gcsConfig: GCSConfig;

  private isDirectory: boolean;

  constructor({ bucket, src, gcsConfig = {}, isDirectory }: GCSLoaderParams) {
    super();
    this.bucket = bucket;
    this.src = src;
    this.gcsConfig = {
      ...gcsConfig,
      clientOptions: {
        ...gcsConfig.clientOptions,
        scopes: [
          ...gcsConfig.clientOptions.scopes,
          'https://www.googleapis.com/auth/devstorage.read_write',
          'https://www.googleapis.com/auth/cloud-platform',
        ],
      },
    };
    this.isDirectory = isDirectory;
  }

  private _load = async (): Promise<{
    texts: string[];
    metadatas: Record<string, any>[];
  }> =>
    new Promise(async (resolve, reject) => {
      const { gcsModule, pdfParse, parseOfficeAsync } =
        await GCSLoaderImports();

      let { Storage } = gcsModule;

      try {
        const StorageClient = new Storage(this.gcsConfig);

        if (Array.isArray(this.src)) {
          return null;
        }

        let [files, {}, metadata] = await StorageClient.bucket(
          this.bucket
        ).getFiles({
          prefix: this.src,
        });

        type GCSFile = (typeof files)[0];

        if (!files.length) throw new Error('Could not find src file/directory');

        if (files.length > 1 && !this.isDirectory)
          throw new Error('Multiple files found, is this path a directory?');

        const parseFile = async (file: GCSFile) => {
          let type = file.metadata?.contentType ?? 'text/plain';
          let [buffer] = await file.download();
          let { text } = await parseDocument(
            { type, buffer },
            pdfParse,
            parseOfficeAsync
          );
          return text;
        };

        let texts: string[] = [];

        let metadatas: Record<string, any>[] = [];

        let p =
          this.src[this.src.length - 1] == '/'
            ? this.src.slice(0, this.src.length - 1)
            : this.src;

        let parts = p.split('/');

        let directoryName = parts[parts.length - 1];

        for (let file of files) {
          try {
            let text = await parseFile(file);
            texts.push(text);

            let metadata = this.isDirectory
              ? {
                  directory: directoryName,
                }
              : {};

            metadatas.push(metadata);
          } catch (e) {
            throw new Error(`Error parsing file ${file.name}`);
          }
        }

        resolve({ texts, metadatas });
      } catch (e) {
        reject(
          e?.message ??
            `Failed to download file ${this.src} from GCS bucket ${this.bucket}.`
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
      throw new Error(`GCSLoader: ${e?.message ?? 'Unable to load files'}`);
    }
  };

  public async loadAndSplit(
    splitter?: TextSplitter
  ): Promise<Document<Record<string, any>>[]> {
    try {
      let { texts, metadatas } = await this._load();

      let documents = splitter.createDocuments(texts, metadatas);

      return documents;
    } catch (e) {
      throw new Error(`GCSLoader: ${e?.message ?? 'Unable to load and split files'}`);
    }
  }
}

const parseDocument = async (
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
      reject(e.message);
    }
  });

async function GCSLoaderImports() {
  try {
    const gcsModule = await import('@google-cloud/storage');

    const pdfParse = await import('pdf-parse');

    const { parseOfficeAsync } = await import('officeparser');

    return { gcsModule, pdfParse, parseOfficeAsync } as {
      gcsModule: typeof gcsModule;
      pdfParse: typeof pdfParse;
      parseOfficeAsync: typeof parseOfficeAsync;
    };
  } catch (e) {
    console.error(e);
    throw new Error(
      "Failed to load GCS Loader Imports'. Please install it eg. `npm i @google-cloud/storage pdf-parse officeparser`."
    );
  }
}
