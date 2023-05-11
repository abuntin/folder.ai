import { QueryService } from './Query';

export const chunkSize = 1000;
export const chunkOverlap = 0;

export const pineconeConfig = {
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
};

export const queryService = new QueryService()