import {
  DocumentProcessorServiceClient
} from '@google-cloud/documentai';
import { DEFAULT_PROCESSOR_ID, PROJECT_ID, PROJECT_LOCATION } from '../types';
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, SERVICE_ACCOUNT_DOCAI } from '../types/environment';

export const DocAIClient = new DocumentProcessorServiceClient({
  projectId: PROJECT_ID,
  credentials: SERVICE_ACCOUNT_DOCAI,
  clientOptions: {
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    scopes: [
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  }
});


export const DefaultProcessor =
  `projects/${PROJECT_ID}` +
  `/locations/${PROJECT_LOCATION}/processors/${DEFAULT_PROCESSOR_ID}`;
