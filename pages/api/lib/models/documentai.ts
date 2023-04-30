import {
  DocumentProcessorServiceClient
} from '@google-cloud/documentai';
import { DEFAULT_PROCESSOR_ID, PROJECT_ID, PROJECT_LOCATION } from '../types';
import serviceAccountKey from 'lib/serviceAccountKey.json';

export const DocAIClient = new DocumentProcessorServiceClient({
  projectId: PROJECT_ID,
  credentials: serviceAccountKey
});

export const DefaultProcessor =
  `projects/${PROJECT_ID}` +
  `/locations/${PROJECT_LOCATION}/processors/${DEFAULT_PROCESSOR_ID}`;
