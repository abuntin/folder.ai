// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { Storage } from '@google-cloud/storage';
import { getStorage, ref } from 'firebase/storage';
import { FolderManager } from './FolderManager';
import { initFolderManager } from './FolderManager/init';
import { listFolder } from './FolderManager/list';
import { uploadFolder } from './FolderManager/upload';
import { renameFolder } from './FolderManager/rename';
import { createDirectory } from './FolderManager/create';
import { deleteFolders } from './FolderManager/delete';
import { moveFolders } from './FolderManager/move';
import { copyFolders } from './FolderManager/copy';
import {
  API_KEY,
  AUTH_DOMAIN,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  MEASUREMENT_ID,
  APP_ID,
  PROJECT_ID,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  SERVICE_ACCOUNT_DOCAI,
} from '../types';
import inngest from 'pages/api/inngest';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const root = ref(storage);

// Initialise Google Cloud Storage
export const StorageClient = new Storage({
  projectId: PROJECT_ID,
  credentials: SERVICE_ACCOUNT_DOCAI,
  clientOptions: {
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    scopes: [
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  },
});

export const folderManagerService = new FolderManager(
  {
    init: initFolderManager,
    upload: uploadFolder,
    list: listFolder,
    rename: renameFolder,
    create: createDirectory,
    delete: deleteFolders,
    move: moveFolders,
    copy: copyFolders,
  },
  inngest
);
