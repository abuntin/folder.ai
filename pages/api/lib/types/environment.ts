export const API_KEY = process.env.API_KEY;
export const APP_ID = process.env.GOOGLE_APP_ID;
export const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;
export const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
export const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
export const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
export const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

export const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const PINECONE_INDEX = process.env.PINECONE_INDEX;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION;

export const HUGGINGFACEHUB_API_KEY = process.env.HUGGINGFACEHUB_API_KEY

export const PROJECT_LOCATION = process.env.PROJECT_LOCATION;
export const DEFAULT_PROCESSOR_ID = process.env.DEFAULT_PROCESSOR_ID;

export const SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT ?? '')

export const METADATA_PATH = '.folderai.json'

export const DOCUMENT_PATH = '.index'