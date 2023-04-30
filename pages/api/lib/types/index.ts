import { protos } from '@google-cloud/documentai';

export type { FolderManagerInterface } from './FolderManagerInterface';

export type IDocument_DocAI = protos.google.cloud.documentai.v1.IDocument;

export {
  PROJECT_ID,
  STORAGE_BUCKET,
  PROJECT_LOCATION,
  API_KEY,
  APP_ID,
  MESSAGING_SENDER_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  DEFAULT_PROCESSOR_ID,
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