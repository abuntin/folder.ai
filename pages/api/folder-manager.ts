import { folderManagerService } from "./lib/models/firebase";
import { FolderManagerHandler, FolderManagerRequest, FolderManagerResponse } from "./lib/types";

const handler: FolderManagerHandler = async (req: FolderManagerRequest, res: FolderManagerResponse) => {

  const handleRes = (response) => {

    console.log('Obtained FolderManagerResponse, processing...')
    
    if (response instanceof Error) res.status(500).json({ error: response });

    else res.status(200).json({ payload: response })
  }


  const data = req.body

  if (!Object.prototype.hasOwnProperty.call(data, 'type')) res.status(500).json({ error: new Error('Unknown FolderManagerRequest')})


  const { type } = data;


  console.log('Initialised FolderManagerRequest.')

  switch (type) {
    case "list":
      console.log('list req')
      let listRes = await folderManagerService.list(data);

      handleRes(listRes)
      break

    case "upload":
      let urlRes = await folderManagerService.upload(data);

      handleRes(urlRes)

      break
    
    case 'init':
      let initRes = await folderManagerService.init(data);

      handleRes(initRes)

      break


    default:

      return res.status(500).json({ error: new Error("Invalid FolderManagerRequest type")});
  }
};

export default handler;
