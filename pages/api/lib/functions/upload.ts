import {
  StorageReference,
  uploadBytesResumable,
  UploadTask,
  getDownloadURL,
} from 'firebase/storage';

export const upload = (
  data: Buffer | Blob | ArrayBuffer,
  metadata,
  destinationRef: StorageReference
): Promise<{
  urls: string[];
}> =>
  new Promise(async (resolve, reject) => {
    try {
      let urls = [];

      const uploadTask = uploadBytesResumable(
        destinationRef,
        data instanceof Blob ? data : new Uint8Array(data),
        metadata
      ) as UploadTask;

      let unsubscribe = uploadTask.on(
        'state_changed',
        // update progress
        async snapshot => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        err => {
          console.error(err, 'here');
          unsubscribe(); // kill upload
          reject(err);
        },
        async () => {
          // download url
          let url = await getDownloadURL(uploadTask.snapshot.ref);

          urls.push(url);
        }
      );

      resolve({ urls });
    } catch (e) {
      reject(e.message);
    }
  });
