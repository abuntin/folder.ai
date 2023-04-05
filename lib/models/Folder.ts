import { PropType } from "lib/types";

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
    * File full path to root
    */
    path: string;
    /**
    * URL to Cloud Storage
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
}