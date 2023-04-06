import { StorageReference, FullMetadata } from "firebase/storage";

export class Folder {

    /**
     * File id
     */
    id: string;
    /**
     * File Name
     */
    name: string;
    /**
    * File full path to user root
    */
    path: string;
    /**
    * Path in browser - for upload tasks
    */
    localPath?: string;
    /**
    * Cloud Storage URL
    */
    url: string;
    /**
    * File size in bits
    */
    size: number;
    /**
    * Linked folders
    * This should be present even with empty array
    */
    linkedFolders: Folder[];

    /**
    * Children
    * This should be present even with empty array
    */
    children: Folder[];

    /**
    * Is directory
    */
    isDirectory: boolean;

    /**
     * Folder.AI + Google Cloud storage metadata
     */
    metadata: Record<string, any> = null;



    constructor(data: any) {

        const keys = Object.keys(this);

        
        for (const key of keys) {

            let val: any = null;

            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (data[key] == null) throw new Error(`Null/undefined in file constructor ${key}`) 
                else val = data[key]
            }
            
            this[key] = val
            
        }
    }

    static fromStorageReference = async (metadata: FullMetadata, isDirectory = false) => ({
        name: metadata.name,
        path: metadata.fullPath,
        url: metadata.ref.toString(),
        size: metadata.size,
        isDirectory,
        children: [],
        linkedFolders: [],
        metadata,
        id: 'randomstr'
    } as Folder)
}