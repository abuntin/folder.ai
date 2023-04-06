import { Folder } from ".";
import events, { EventSubscription } from "@mongez/events";

export type KernelEvent = "loading" | "idle" | "directoryChange" | "load" | "select" | "view";

export class Kernel {
  protected rootPath = "/";

  protected currDirPath = "/";

  protected currDir?: Folder = null;

  /** 
   * Loads root path from Firebase Storage TODO: Expand with user ID
  */

  public async getRootFolder(): Promise<Folder> {
    this.trigger('loading')

    let res = await fetch('api/folder-manager-service', {
      body: JSON.stringify({
        type: 'init'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { payload, error } = await res.json();

    if (error) {
      this.trigger('load', error)

      throw error as Error
    }

    else {
      this.setRootPath(payload.rootPath)
      return payload.rootFolder
    }

  }


  /**
   * Set root path
   */
  public setRootPath(rootPath: string): Kernel {
    this.rootPath = rootPath;
    return this;
  }

  /**
   * Load the given folder
   * @returns Payload of { folders, directories }
   */
  public async load(folder: Folder): Promise<Folder[]> {
    // trigger loading event
    this.trigger("loading");

    let res = await fetch('/api/folder-manager-service', {
      body: JSON.stringify({
       folder, 
       type: 'list'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { payload, error } = await res.json();

    if (error) {
      this.trigger('load', error)

      throw error as Error
    }

    else {

      // if (this.currDirPath !== path) {
      //   this.trigger('directoryChange', path)
      // }

      return payload


    }

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
