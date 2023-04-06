import { root } from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { Folder } from "lib/models";
import { PropType } from "lib/types";
import { FolderManagerServiceInterface } from "../../types";


export const uploadFolder: PropType<FolderManagerServiceInterface, 'upload'> = async (data: any) => {

  try {

    const { folder } = data;

    let destination = folder as Folder;

    const destinationRef = ref(root, `${destination.path}/`);

    const uploadTask = uploadBytesResumable(destinationRef, folder.localPath ?? "");

    uploadTask.on(
      "state_changed",
      // update progress
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (err) => console.log(err),
      async () => {
        // download url
        let url = await getDownloadURL(uploadTask.snapshot.ref);

        return { url };
      }
    );
  } catch (e) {
    console.log(e);
    return e
  }
};
