import { ref, getDownloadURL } from 'firebase/storage';
import { Folder } from 'lib/models';
import { root } from '../models/firebase';

export const fetchDownloadURL = async (payload: { src: Folder }): Promise<{ url: string }> => new Promise(async (resolve, reject) => {
   try {
        let { src } = payload;

        if (src.isDirectory) throw new Error('Cannot download Directory')

        let srcRef = ref(root, `${src.fullPath}`)

        let url = await getDownloadURL(srcRef)

        resolve({ url })
   }
   catch (e) {
       reject(e.message)
   }
})