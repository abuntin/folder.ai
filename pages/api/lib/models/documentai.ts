import {
  DocumentProcessorServiceClient
} from '@google-cloud/documentai';
import { DEFAULT_PROCESSOR_ID, PROJECT_ID, PROJECT_LOCATION } from '../types';
import { SERVICE_ACCOUNT_DOCAI } from '../types/environment';

export const DocAIClient = new DocumentProcessorServiceClient({
  projectId: PROJECT_ID,
  credentials: SERVICE_ACCOUNT_DOCAI
});

export const DefaultProcessor =
  `projects/${PROJECT_ID}` +
  `/locations/${PROJECT_LOCATION}/processors/${DEFAULT_PROCESSOR_ID}`;
