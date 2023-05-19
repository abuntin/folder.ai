import { protos } from '@google-cloud/documentai';

export type { FolderManagerInterface } from './FolderManagerInterface';

export type { QueryInterface } from './QueryInterface';

export type IDocument_DocAI = protos.google.cloud.documentai.v1.IDocument;

export {
  HUGGINGFACEHUB_API_KEY,
  DOCUMENT_PATH,
  METADATA_PATH,
  PINECONE_INDEX,
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  OPENAI_API_KEY,
  OPENAI_ORGANIZATION,
  PROJECT_ID,
  STORAGE_BUCKET,
  PROJECT_LOCATION,
  API_KEY,
  APP_ID,
  MESSAGING_SENDER_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  DEFAULT_PROCESSOR_ID,
  OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, SERVICE_ACCOUNT,
} from './environment';

export const ValidFileTypes = new Set([
  'image/jpeg',
  'image/x-png',
  'image/webp',
  'image/bmp',
  'application/pdf',
  'image/tiff',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
])


export const typeToPath = (type: string) => type.replace(/\//g, "_")

export const typeFromPath = (path: string) => path.replace(/_/g, "/")