import { PropType } from 'lib/types';
import { QueryInterface } from '../lib/types';
import { queryService } from '../lib/models/langchain';


export const config = {
  api: {
    bodyParser: true,
  },
};

const handler: PropType<QueryInterface, 'init'> = queryService.init

export default handler;
