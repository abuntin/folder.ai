import { PropType } from 'lib/types';
import { FolderManagerInterface } from './lib/types';
import { folderManagerService } from './lib/models/firebase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler: PropType<FolderManagerInterface, 'upload'> =
  folderManagerService.upload;
