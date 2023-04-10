import { Folder } from ".";
import { cache } from "react";
import _ from "lodash";
import events, { EventSubscription } from "@mongez/events";
import axios from 'axios'

export type KernelEvent =
  | "loading"
  | "idle"
  | "directoryChange"
  | "load"
  | "select"
  | "view"
  | "upload"
  | 'error'
  | 'refresh'

/**
 * @class Kernel
 * @member rootPath -
 */

export class Kernel {
  public current: Folder = null;

  protected prev: Folder = null;

  public rootFolder: Folder = null;

  public folders: Folder[] = null;

  protected folderManagerUrl = (path: string) => `api/folder-manager/${path}`

  /**
   * Set current directory
   * @param folder Folder
   */
  set currentDirectory(folder: Folder) {
    this.current = folder;
  }

  /**
   * Set prev directory
   * @param folder Folder
   */
  set prevDirectory(folder: Folder) {
    this.prev = folder;
  }

  /**
   * Set root folder
   * @param path string
   */
  set rootF(folder: Folder) {
    this.rootFolder = folder;
  }

  /**
   * Set current folders
   * @param folders Folder[]
   */
  set currentFolders(folders: Folder[]) {
    this.folders = folders;
  }

  get isRoot() {
    return this.current.id === this.rootFolder.id;
  }

  /**
   * Navigates to previous Folder
   */

  public goBack = cache(async () => {
    if (this.isRoot || !this.prev) return;

    this.trigger("load", this.prev);
  });

  /**
   * Gets root folder from Firebase Storage TODO: Expand with user ID
   * @param signal AbortSignal. Defaults to null
   */

  public init = cache(
    async (signal: AbortSignal = null): Promise<void> => {
      console.log("Initialised Kernel.getRootFolder()");

      this.trigger("loading", "Initialising...");

      try {
        let res = await fetch(this.folderManagerUrl('init'), {
          body: JSON.stringify({
            type: "init",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal,
        });

        const { data: rootFolder, error }: {
          data: Folder | null;
          error: string | null;
        } = await res.json();

        console.log("Obtained Kernel.getRootFolder() response");

        if (error || !rootFolder) throw new Error(error ?? 'Missing Kernel.init() response data');
        else {
          this.rootF = rootFolder;
          this.currentDirectory = rootFolder
          this.trigger("idle", "Obtained root folder");
        }
      } catch (e) {
        this.trigger("error", e.message);
        throw e
      }
    }
  );

  /**
   * Load the given folder onto kernel 
   */
  public load = cache(
    async (
      folder: Folder,
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log("Initialised Kernel.load()");

      this.trigger("loading");

      try {
        let res = await fetch(this.folderManagerUrl('list'), {
          body: JSON.stringify({
            folder,
            type: "list",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal,
        });

        console.log("Obtained Kernel.load() response");

        const { data, error }: {
          data:{
            folders: Folder[],
            directories: Folder[]
          } | null;
          error: string | null;
        } = await res.json();

        if (error || !data) throw new Error(error ?? 'Missing Kernel.load() response data');
        else {
          const { folders, directories } = data
          if (this.current.path !== folder.path) {
            let temp = this.current;
            this.currentDirectory = folder;
            !this.isRoot && (this.prevDirectory = temp);
          }
          this.currentFolders = folders.concat(directories)
          this.trigger("idle", "Loaded Folder children");
        }
      } catch (e) {
        this.trigger("error", e.message);
      }
    }
  );

  /**
   * Refreshes the current folder
   */

  public refresh = cache(async () => {

    if (!this.current) return

    return this.load(this.current)

  })
  /**
   * Upload files to given folder
   * @param payload { folder: Folder, files: File[] }
   */

  public upload = cache(
    async (
      payload: { folder: Folder; files: File[] },
      onUploadProgress = null
    ): Promise<string[]> => {

      const { folder, files } = payload;

      console.log("Initialised Kernel.upload()");
      try {
        console.log(files, 'payload')

        //this.trigger('uploading', `Uploading ${files.length === 0 ? files[0].name : `${files.length} files`}...`)

        let formData = new FormData();

        formData.append( 'type', 'upload' );
        formData.append( 'folder', JSON.stringify(folder))
        files.forEach((file) => formData.append("media", file));
    
        const res = await fetch(this.folderManagerUrl('upload'), {
          method: "POST",
          body: formData,
        });

        // const res = await axios.request({
        //   method: 'POST',
        //   url: this.folderManagerUrl('upload'),
        //   data: formData,
        //   onUploadProgress,
        // })
    
        const {
          data,
          error,
        }: {
          data:{
            url: string | string[];
          } | null;
          error: string | null;
        } = await res.json();
    
        if (error || !data) throw new Error(error ?? 'Missing Kernel.upload() response data')
    
        console.log("File was uploaded successfully:", payload);

        this.trigger("idle", `Uploaded ${files.length === 0 ? files[0].name : `${files.length} files`}.`);

        //alert(`File available to download at ${Array.isArray(data.url) ? data.url : [data.url]}`)]]

        console.log(data.url)
        
        return Array.isArray(data.url) ? data.url : [data.url];

      } catch (error) {
        console.error(error);
        this.trigger("error", error.message);
      }
    }
  );
  /**
   * Add event listener to the given event
   * @param event KernelEvent
   * @param callback any
   */
  public on(event: KernelEvent, callback: any): EventSubscription {
    return events.subscribe(`kernel.${event}`, callback);
  }

  /**
   * Trigger the given event
   * @param event KernelEvent
   * @param ...args any[]
   */
  public trigger(event: KernelEvent, ...args: any[]): void {
    events.trigger(`kernel.${event}`, ...args);
  }
}

// /**
//  * App Kernel instance
//  */
// export const kernel = new Kernel()

// /**
//  * Helper function for @preload
//  */

// const init = async () => {
//   let src = await kernel.getRootFolder();

//   kernel
//     .load(src)
//     .then(({ folders, directories }) => kernel.currentFolders = folders.concat(directories))
//     .catch((e) => kernel.trigger('loading', e.message))
// };

// /**
//  * Helper function to prepopulate kernel during startup
//  */
// export const preload = () => {
//   console.log('init preload')
//   void init();
// };
