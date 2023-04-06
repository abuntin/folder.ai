import { folderManagerService } from "./lib/models/firebase";
import { FolderManagerHandler, FolderManagerRequest, FolderManagerResponse } from "./lib/types";

const handler: FolderManagerHandler = async (req: FolderManagerRequest, res: FolderManagerResponse) => {


  const handleRes = (response) => {
    if (response instanceof Error) throw response;

    else return res.status(200).json({ payload: response })
  }


  const data = req.body

  if (!Object.prototype.hasOwnProperty.call(data, 'type')) res.status(500).json({ error: new Error('Unknown FolderManagerRequest')})


  const { type } = data;

  switch (type) {
    case "list":
      let listRes = await folderManagerService.list(data);

      return handleRes(listRes)

    case "upload":
      let urlRes = await folderManagerService.upload(data);

      return handleRes(urlRes)
    
    case 'init':
      let initRes = await folderManagerService.init(data);

      return handleRes(initRes)


    default:

      return res.status(500).json({ error: new Error("Invalid FolderManagerRequest type")});
  }
};

export default handler;
