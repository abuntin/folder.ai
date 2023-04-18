import { PropType } from 'lib/types';
import { FolderManagerInterface } from '../lib/types';
import { folderManagerService } from '../lib/models/firebase';


export const config = {
  api: {
    bodyParser: true,
  },
};

const handler: PropType<FolderManagerInterface, 'create'> =
  folderManagerService.create;

export default handler;
