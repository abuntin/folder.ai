import { QueryService } from './Query';
import { PINECONE_ENVIRONMENT, PINECONE_API_KEY } from '../types';

export const chunkSize = 1000;
export const chunkOverlap = 0;

export const pineconeConfig = {
  environment: PINECONE_ENVIRONMENT,
  apiKey: PINECONE_API_KEY,
};

export const queryService = new QueryService()