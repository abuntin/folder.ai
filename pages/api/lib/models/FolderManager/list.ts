import { root } from "../firebase";
import { getMetadata, listAll, ref } from "firebase/storage";
import { Folder } from "lib/models";
import { PropType } from "lib/types";
import { FolderManagerInterface } from "../../types";

export const listFolder: PropType<FolderManagerInterface, "list"> = async (
  data: any
) => {
  try {
    const { folder } = data;

    let src = folder as Folder;

    if (!Object.prototype.hasOwnProperty.call(src, "path"))
      throw new Error("Invalid data arg to list()");

    if (!src.isDirectory) throw new Error("Called list on Folder");

    console.log("Initialised FolderManager.list()");

    const srcRef = ref(root, `${src.path}/`);

    let res = await listAll(srcRef);

    let folders = await Promise.all(
      res.items.map(async (ref, i) => {
        //let metadata = await getMetadata(item);

        // return await Folder.fromStorageReference(metadata);

        return {
          name: ref.name,
          path: ref.fullPath,
          isDirectory: false,
          id: "rootID" + i,
          url: ref.toString(),
        } as Folder;
      })
    );

    let directories = await Promise.all(
      res.prefixes.map(async (ref, i) => {
        return {
          name: ref.name,
          path: ref.fullPath,
          isDirectory: true,
          id: "rootID" + i,
          url: ref.toString(),
        } as Folder;
      })
    );

    console.log("Obtained Folder children");

    return { folders, directories };
  } catch (e) {
    console.log(e);
    return e as Error;
  }
};
