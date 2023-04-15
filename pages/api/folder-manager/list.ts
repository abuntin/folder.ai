import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../lib/types';
import { folderManagerService } from '../lib/models/firebase';

const handler: PropType<FolderManagerInterface, 'list'> =
  folderManagerService.list;

export default handler;
