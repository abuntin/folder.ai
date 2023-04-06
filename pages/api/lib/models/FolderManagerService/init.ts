import { root } from "../firebase";
import { getMetadata, listAll } from "firebase/storage";
import { PropType } from "lib/types";
import { Folder } from "lib/models";
import { FolderManagerServiceInterface } from "../../types";


export const initFolderService: PropType<FolderManagerServiceInterface, 'init'> = async (data: any) => {

  try {

    let res = await listAll(root)

    let ref = res.prefixes[0]

    let rootFolder = { 
      name: ref.name,
      path: ref.fullPath, 
      isDirectory: true,
      id: 'rootID',
      url: ref.toString()
    } as Folder

    return { rootFolder }

  } catch (e) {
    console.log(e);
    return e as Error;
  }
};
