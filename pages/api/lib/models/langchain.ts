import { QueryService } from './Query';
import { PINECONE_ENVIRONMENT, PINECONE_API_KEY } from '../types';

export const chunkSize = 2000;
export const chunkOverlap = 200;

export const pineconeConfig = {
  environment: PINECONE_ENVIRONMENT,
  apiKey: PINECONE_API_KEY,
};

export const queryService = new QueryService()