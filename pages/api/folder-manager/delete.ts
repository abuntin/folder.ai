import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../lib/types';
import { folderManagerService } from '../lib/models/firebase';

const handler: PropType<FolderManagerInterface, 'delete'> =
  folderManagerService.delete;

export default handler;
