import {
  getDownloadURL,
  StorageReference,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';

export const upload = (payload: {
  data: Buffer | Blob | ArrayBuffer,
  ref: StorageReference,
  metadata?
}): Promise<{ url: string }> =>
  new Promise(async (resolve, reject) => {
    try {

      let { data, ref, metadata } = payload;

      const uploadTask = uploadBytesResumable(
        ref,
        (data instanceof Blob || data instanceof Uint8Array) ? data : new Uint8Array(data),
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

          unsubscribe();

          resolve({ url });
        }
      );
    } catch (e) {
      reject(e.message);
    }
  });
