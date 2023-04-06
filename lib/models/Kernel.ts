import { Folder } from ".";
import { cache } from "react";
import _ from "lodash";
import events, { EventSubscription } from "@mongez/events";

export type KernelEvent =
  | "loading"
  | "idle"
  | "directoryChange"
  | "load"
  | "select"
  | "view";

/**
 * @class Kernel
 * @member rootPath -
 */

export class Kernel {

  public current: Folder = null;

  protected prev: Folder = null;

  protected rootFolder: Folder = null;

  public folders: Folder[] = null;

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
    return this.current.id === this.rootFolder.id
  }

  /**
   * Navigates to previous Folder
   */

  public goBack = cache(async () => {
    if (this.isRoot || !this.prev) return;

    this.trigger('load', this.prev)

  })

  /**
   * Loads root path from Firebase Storage TODO: Expand with user ID
   * @param signal AbortSignal. Defaults to null
   * @returns rootFolder - Folder[]
   */

  public getRootFolder = cache(
    async (signal: AbortSignal = null): Promise<Folder> => {
      console.log("Initialised Kernel.getRootFolder()");

      this.trigger("loading", "Initialising...");

      let res = await fetch("api/folder-manager", {
        body: JSON.stringify({
          type: "init",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal,
      });

      const { payload, error } = await res.json();

      console.log("Obtained Kernel.getRootFolder() response", payload, error);

      if (error) {
        this.trigger("idle", error);

        throw error as Error;
      } else {

        this.rootF = payload.rootFolder

        this.trigger("idle", "Loaded Root Folder");

        return payload.rootFolder;
      }
    }
  );

  /**
   * Load the given folder
   * @returns Promise<{ folders: Folder[], directories: Folder[] }>
   */
  public load = cache(
    async (
      folder: Folder,
      signal: AbortSignal = null
    ): Promise<{ folders: Folder[]; directories: Folder[] }> => {
      console.log("Initialised Kernel.load()", folder);
      // trigger loading event
      this.trigger("loading");

      let res = await fetch("/api/folder-manager", {
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

      console.log("Obtained Kernel.load() response", res);

      const { payload, error } = await res.json();

      if (error) {
        this.trigger("idle", error);

        return { folders: [], directories: [] };
      } else {
        if (this.current.path !== folder.path) {
          let temp = this.current
          this.currentDirectory = folder
          !this.isRoot && (this.prevDirectory = temp)
        }
        this.trigger("idle");
        return payload;
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
