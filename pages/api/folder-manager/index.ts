import { folderManagerService } from '../lib/models/firebase';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // const handleRes = response => {
  //   console.log('Obtained NextApiResponse, processing...');
  //   if (response instanceof Error) res.status(500).json({ error: response });
  //   else res.status(200).json({ payload: response });
  // };
  // const data = req.body
  // console.log(data.type);
  // if (!Object.prototype.hasOwnProperty.call(data, 'type')) {
  //   console.log('Missing type property in NextApiRequest');
  //   res.status(500).json({ error: new Error('Unknown NextApiRequest') });
  //   return;
  // }
  // const { type } = data;
  // console.log('Initialised NextApiRequest.');
  // switch (type) {
  //   case 'list':
  //     console.log(data.folder.path);
  //     let listRes = await folderManagerService.list(data);
  //     handleRes(listRes);
  //     break;
  //   case 'upload':
  //     let urlRes = await folderManagerService.upload(data);
  //     handleRes(urlRes);
  //     break;
  //   case 'init':
  //     let initRes = await folderManagerService.init(data);
  //     handleRes(initRes);
  //     break;
  //   default:
  //     return res
  //       .status(500)
  //       .json({ error: new Error('Invalid NextApiRequest type') });
  // }
};

export default handler;
