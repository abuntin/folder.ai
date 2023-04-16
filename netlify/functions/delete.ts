import { PropType } from 'lib/types';
import { FolderManagerInterface } from './lib/types';
import { folderManagerService } from './lib/models/firebase';

export const handler: PropType<FolderManagerInterface, 'delete'> =
  folderManagerService.delete;
