import { fileManagerService } from "lib/services";
import { Folder } from ".";
import events, { EventSubscription } from "@mongez/events";

export type KernelEvent = "loading" | "idle" | "directoryChange" | "load" | "select";

export class Kernel {
  protected rootPath = "/";

  protected currDirPath = "/";

  protected currDir?: Folder = null;

  /**
   * Set root path
   */
  public setRootPath(rootPath: string): Kernel {
    this.rootPath = rootPath;
    return this;
  }

  /**
   * Load the given path
   */
  public load(path: string): Promise<Folder> {
    // trigger loading event
    this.trigger("loading");

    return new Promise((resolve, reject) => {
      fileManagerService
        .list(path)
        .then((response) => {
          // trigger load event as the directory has been loaded successfully.
          this.trigger("load", response.data.folder);
          this.currDirPath = path;
          this.currDir = response.data.folder;
          // if the current directory is not as the same loaded directory path,
          // then we'll trigger directory changed event.
          if (response.data.folder.path !== this.currDirPath) {
            this.trigger("directoryChange", this.currDir);
          }

          resolve(this.currDir as Folder);
        })
        .catch(reject);
    });
  }

  /**
   * Add event listener to the given event
   */
  public on(event: KernelEvent, callback: any): EventSubscription {
    return events.subscribe(`kernel.${event}`, callback);
  }

  /**
   * Trigger the given event
   */
  public trigger(event: KernelEvent, ...args: any[]): void {
    events.trigger(`kernel.${event}`, ...args);
  }
}
