import { Folder } from ".";
import { cache } from "react";
import _ from 'lodash'
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
  protected rootPath = "/";

  protected currDirPath = "/";

  protected currDir?: Folder = null;

  protected rootFolder: Folder = null;

  public folders: Folder[] = null;

  /**
   * Set root path
   * @param path string
   */
  set root(path: string) {
    this.rootPath = path
  }

  /**
   * Set current path
   * @param path string
   */
  set currentPath(path: string) {
    this.currDirPath = path
  }

  /**
   * Set current directory
   * @param folder Folder
   */
  set currentDirectory(folder: Folder) {
    this.currDir = folder
  }

  /**
   * Set root folder
   * @param path string
   */
  set folder(path: string) {
    this.rootPath = path
  }

  /**
   * Set current folders
   * @param folders Folder[]
   */
  set currentFolders(folders: Folder[]) {
    this.folders = folders
  }

  /**
   * Loads root path from Firebase Storage TODO: Expand with user ID
   * @param signal AbortSignal. Defaults to null
   * @returns rootFolder - Folder[]
   */

  public getRootFolder = cache(async (signal: AbortSignal = null): Promise<Folder> => {
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
      signal
    });

    const { payload, error } = await res.json();

    console.log("Obtained Kernel.getRootFolder() response", payload, error);

    if (error) {
      this.trigger("idle", error);

      throw error as Error;
    } else {
      this.root = payload.rootPath;

      this.trigger("idle", "Loaded Root Folder");

      return payload.rootFolder;
    }
  })

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
        signal
      });

      console.log("Obtained Kernel.load() response", res);

      const { payload, error } = await res.json();

      if (error) {
        this.trigger("idle", error);

        return { folders: [], directories: [] };
      } else {
        // if (this.currDirPath !== path) {
        //   this.trigger('directoryChange', path)
        // }
        this.trigger('idle')
        return payload;
      }
    }
  )

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
