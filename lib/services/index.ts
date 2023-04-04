
import { Folder, rootFolder } from 'lib/models'


const fetchFolder = (path: string, folder = undefined as Folder): Folder | null => {
    if (!folder) folder = rootFolder;

    if (folder.path === path) return folder

    for (let child of folder.children) {

        let found = fetchFolder(path, child)

        return found ?? null
    }

    return null
}

class FileManagerService implements FileManagerServiceInterface  {

    /**
     * {@inheritDoc}
     */
    public list(directoryPath: string): Promise<any> {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: {
                folder: fetchFolder(directoryPath),
              },
            });
          }, 3000);
        });
    }

    /**
     * {@inheritDoc}
     */
    public createDirectory(directoryName: string, saveTo: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    /**
     * {@inheritDoc}
     */
    public delete(paths: string[]): Promise<any> {
        throw new Error("Method not implemented.");
    }
    /**
     * {@inheritDoc}
     */
    public rename(path: string, newPath: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    /**
     * {@inheritDoc}
     */
    public copy(paths: string[], destination: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    /**
     * {@inheritDoc}
     */
    public move(paths: string[], destination: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    /**
     * {@inheritDoc}
     */
    public upload(files: File[], directoryPath: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

export default interface FileManagerServiceInterface {
    /**
     * List directory contents for the given path
     */
    list(directoryPath: string): Promise<any>;
  
    /**
     * Create new directory
     *
     * First parameter will be the directory name,
     * second parameter will be the directory path that will be created into.
     */
    createDirectory(directoryName: string, saveTo: string): Promise<any>;
  
    /**
     * Delete directories/files
     */
    delete(paths: string[]): Promise<any>;
  
    /**
     * Rename directory | file
     *
     * The first parameter will be the old path,
     * the second parameter will be the new path.
     */
    rename(path: string, newPath: string): Promise<any>;
  
    /**
     * Copy the given files/directories to the given destination
     */
    copy(paths: string[], destination: string): Promise<any>;
  
    /**
     * Move the given files/directories to the given destination
     */
    move(paths: string[], destination: string): Promise<any>;
  
    /**
     * Upload the given files into the given directory path
     */
    upload(files: File[], directoryPath: string): Promise<any>;
}

export const fileManagerService = new FileManagerService()