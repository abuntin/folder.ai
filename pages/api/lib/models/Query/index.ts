import { PineconeClient as PineClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { pineconeConfig, chunkOverlap, chunkSize } from '../langchain';
import { QueryInterface } from '../../types';
import { NextApiRequest, NextApiResponse } from 'next';

export class QueryService implements QueryInterface {
  Embeddings: OpenAIEmbeddings = null;
  TextSplitter: RecursiveCharacterTextSplitter = null;
  PineconeClient: PineClient = null;

  index: VectorOperationsApi = null;

  constructor(data?: Partial<QueryService>) {
    if (data) {
      let keys = Object.keys(this);

      for (let key of keys) {
        if (Object.prototype.hasOwnProperty.call(data, key))
          this[key] = data[key];
      }
    }

    this.PineconeClient = new PineClient()

    this.Embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.TextSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
  }

  /**
   * {@inheritdoc}
   */
  public init = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({
        data: null,
        error: 'Method Not Allowed',
      });
      return;
    }

    try {
      console.log('Initialised QueryService.init()');
      
      const { type } = req.body;

      if (!type || type !== 'init')
        return res
          .status(405)
          .json({ data: null, error: 'Invalid NextApiRequest type' });

      await this.PineconeClient.init(pineconeConfig);

      this.index = this.PineconeClient.Index('root');

      console.log('Initialised Pinecone');

      return res.status(200).json({ data: true, error: null });
    } catch (e) {
      return res
        .status(500)
        .json({ data: null, error: e?.message ?? 'Error initialising Query' });
    }
  };
}
