// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
import { FolderManager } from './FolderManager';
import { initFolderManager } from './FolderManager/init';
import { listFolder } from './FolderManager/list';
import { uploadFolders } from './FolderManager/upload';
import { renameFolder } from './FolderManager/rename';
import { createDirectory } from './FolderManager/create';
import { deleteFolders } from './FolderManager/delete';
import { moveFolders } from './FolderManager/move';
import { copyFolders } from './FolderManager/copy';
import { API_KEY, AUTH_DOMAIN, STORAGE_BUCKET, MESSAGING_SENDER_ID, MEASUREMENT_ID, APP_ID, PROJECT_ID } from '../types';

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
export const folderManagerService = new FolderManager({
  init: initFolderManager,
  upload: uploadFolders,
  list: listFolder,
  rename: renameFolder,
  create: createDirectory,
  delete: deleteFolders,
  move: moveFolders,
  copy: copyFolders,
});
