import { Directory, Folder } from '.';
import { cache } from 'react';
import _ from 'lodash';
import events, { EventSubscription } from '@mongez/events';

export type KernelEvent =
  | 'loading'
  | 'idle'
  | 'directoryChange'
  | 'load'
  | 'select'
  | 'view'
  | 'upload'
  | 'error'
  | 'refresh'
  | 'warning'
  | 'copy'
  | 'paste'
  | 'cut'
  | 'delete'
  | 'move'
  | 'rename'
  | 'create';

/**
 * @class Kernel
 * @member rootPath -
 */

export class Kernel {
  public current: Directory = null;

  protected prev: Folder = null;

  public rootDirectory: Directory = null;

  public folders: Folder[] = null;

  public foldersExcl: Folder[] = null;

  public directoriesExcl: Directory[] = null;

  protected folderManagerUrl = (path: string) => `api/folder-manager/${path}`


  /**
   * Set current directory
   * @param folder Folder
   */
  set currentDirectory(directory: Directory) {
    this.current = directory;
  }

  /**
   * Set prev Directory
   * @param folder Folder
   */
  set prevDirectory(directory: Directory) {
    this.prev = directory;
  }

  /**
   * Set root Directory
   * @param path string
   */
  set rootF(directory: Directory) {
    this.rootDirectory = directory;
  }

  /**
   * Set current Folders
   * @param folders Folder[]
   */
  set currentFolders(folders: Folder[]) {
    this.folders = folders;
  }

  get isRoot() {
    return this.current.id === this.rootDirectory.id;
  }

  /**
   * Navigates to previous Directory
   */

  public goBack = cache(async () => {
    if (this.isRoot || !this.prev) return;

    this.trigger('load', this.prev);
  });

  /**
   * Gets root Folder from Firebase Storage TODO: Expand with user ID
   * @param signal AbortSignal. Defaults to null
   */

  public init = cache(async (signal: AbortSignal = null): Promise<void> => {
    console.log('Initialised Kernel.getRootFolder()');

    this.trigger('loading', 'Initialising...');

    try {

      let res = await fetch(this.folderManagerUrl('init'), {
        body: JSON.stringify({
          type: 'init',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        signal,
      });

      const {
        data: rootDirectory,
        error,
      }: {
        data: Directory | null;
        error: string | null;
      } =  await res.json(); 

      console.log('Obtained Kernel.getRootFolder() response');

      if (error || !rootDirectory)
        throw new Error(error ?? 'Missing Kernel.init() response data');
      else {
        this.rootF = rootDirectory;
        this.currentDirectory = rootDirectory;
        this.trigger('idle', 'Obtained root folder');
      }
    } catch (e) {
      this.trigger('error', e.message);
      throw e;
    }
  });

  /**
   * Load the given Directory onto kernel
   */
  public load = cache(
    async (directory: Directory, signal: AbortSignal = null): Promise<void> => {
      console.log('Initialised Kernel.load()');

      this.trigger('loading');

      try {
        let res = await fetch(this.folderManagerUrl('list'), {
          body: JSON.stringify({
            directory,
            type: 'list',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.load() response');

        const {
          data,
          error,
        }: {
          data: {
            folders: Folder[];
            directories: Folder[];
          } | null;
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.load() response data');
        else {
          const { folders, directories } = data;
          if (this.current.path !== directory.path) {
            let temp = this.current;
            this.currentDirectory = directory;
            !this.isRoot && (this.prevDirectory = temp);
          }
          this.foldersExcl = folders;
          this.directoriesExcl = directories;
          this.currentFolders = folders.concat(directories);
          this.trigger('idle', 'Loaded Folder children');
        }
      } catch (e) {
        this.trigger('error', e.message);
        this.trigger('idle');
      }
    }
  );

  /**
   * Refreshes the current Directory
   */

  public refresh = cache(async () => {
    if (!this.current) return;

    return this.load(this.current);
  });

  /**
   * Upload files to given Directory
   * @param payload { directory: Directory, files: File[] }
   */

  public upload = cache(
    async (
      payload: { directory: Directory; files: File[] },
      onUploadProgress = null,
      signal: AbortSignal = null
    ): Promise<string[]> => {
      const { directory, files } = payload;

      console.log('Initialised Kernel.upload()');
      try {
        this.trigger(
          'warning',
          `Uploading ${
            files.length === 1 ? files[0].name : `${files.length} files`
          } to ${directory.name}...`
        );

        let formData = new FormData();

        formData.append('type', 'upload');
        formData.append('directory', JSON.stringify(directory));
        files.forEach((file, i) => formData.append(`media`, file));

        const res = await fetch(this.folderManagerUrl('upload'), {
          method: 'POST',
          body: formData,
        });

        const {
          data,
          error,
        }: {
          data: {
            urls: string[];
          } | null;
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.upload() response data');

        this.trigger('refresh');

        this.trigger(
          'idle',
          `Uploaded ${
            files.length === 1 ? files[0].name : `${files.length} files`
          }.`
        );

        return data.urls;
      } catch (error) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        console.error(error);
        this.trigger('error', error.message);
      }
    }
  );

  /**
   * Copy Folders to Directory
   * @param payload { folders: Folder[], directory: Directory }
   */

  public copy = cache(
    async (
      payload: {
        folders: Folder[];
        directory: Directory;
      },
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.copy()');

      try {
        const { folders, directory } = payload;

        this.trigger(
          'warning',
          `Copying ${
            folders.length === 1 ? folders[0].name : `${folders.length} Folders`
          } to ${directory.name}...`
        );
        let res = await fetch(this.folderManagerUrl('copy'), {
          body: JSON.stringify({
            folders,
            directory,
            type: 'copy',
          }),
          
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.copy() response');

        const {
          data,
          error,
        }: {
          data: {
            urls: string[];
          } | null;
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.copy() response data');
        else {
          this.trigger('cut', []);
          this.trigger(
            'idle',
            `Copied ${
              folders.length === 1
                ? folders[0].name
                : `${folders.length} Folders`
            } to ${directory.name}...`
          );
        }
      } catch (e) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        this.trigger('error', e.message);
      }
    }
  );

  /**
   * Move Folders to Directory
   * @param payload { folders: Folder[], directory: Directory }
   */

  public move = cache(
    async (
      payload: {
        folders: Folder[];
        directory: Directory;
      },
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.move()');

      try {
        const { folders, directory } = payload;

        this.trigger(
          'warning',
          `Moving ${
            folders.length === 1 ? folders[0].name : `${folders.length} Folders`
          } to ${directory.name}...`
        );
        let res = await fetch(this.folderManagerUrl('move'), {
          body: JSON.stringify({
            folders,
            directory,
            type: 'move',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.move() response');

        const {
          data,
          error,
        }: {
          data: {
            urls: string[];
          } | null;
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.move() response data');
        else {
          this.trigger('cut', []);
          this.trigger('refresh');
          this.trigger(
            'idle',
            `Moved ${
              folders.length === 1
                ? folders[0].name
                : `${folders.length} Folders`
            } to ${directory.name}`
          );
        }
      } catch (e) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        this.trigger('error', e.message);
      }
    }
  );

  /**
   * Delete Folder or Directory
   * @param folder Folder
   */

  public delete = cache(
    async (folders: Folder[], signal: AbortSignal = null): Promise<void> => {
      console.log('Initialised Kernel.delete()');

      try {
        this.trigger('warning', `Deleting ${folders.length} Folders...`);

        let res = await fetch(this.folderManagerUrl('delete'), {
          body: JSON.stringify({
            folders,
            type: 'delete',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.delete() response');

        const {
          data,
          error,
        }: {
          data: true | null;
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.delete() response data');
        else {
          this.trigger('cut', []);
          this.trigger('refresh');
          this.trigger('idle', `Deleted ${folders.length} Folders`);
        }
      } catch (e) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        this.trigger('error', e.message);
      }
    }
  );

  /**
   * Create new Directory in specified Directory (default this.current)
   * @param payload { name: string, directory: Directory }
   */

  public create = cache(
    async (
      payload: {
        name: string;
        directory: Directory;
      },
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.create()');

      try {
        const { name, directory = this.current } = payload;

        this.trigger(
          'warning',
          `Creating new Directory ${name} in ${directory.name}...`
        );

        let res = await fetch(this.folderManagerUrl('create'), {
          body: JSON.stringify({
            name,
            directory,
            type: 'create',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.create() response');

        const {
          data,
          error,
        }: {
          data: { url: string };
          error: string | null;
        } = await res.json(); 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.create() response data');
        else {
          if (directory.path === this.current.path) this.trigger('refresh');
          this.trigger(
            'idle',
            `Created new Directory ${name} in ${directory.name}`
          );
        }
      } catch (e) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        this.trigger('error', e.message);
      }
    }
  );

  /**
   * Rename Foldre in specified Directory (default this.current)
   * @param payload { folder: Folder, name: string, directory: Directory }
   */

  public rename = cache(
    async (
      payload: { name: string; folder: Folder; directory: Directory },
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.create()');

      try {
        const { name, folder, directory = this.current } = payload;

        this.trigger(
          'warning',
          `Renaming Folder ${folder.name} to ${name} in ${directory.name}...`
        );

        let res = await fetch(this.folderManagerUrl('rename'), {
          body: JSON.stringify({
            name,
            folder,
            directory,
            type: 'rename',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          signal,
        });

        console.log('Obtained Kernel.rename() response');

        const {
          data,
          error,
        }: {
          data: { url: string };
          error: string | null;
        } = await res.json() 

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.rename() response data');
        else {
          if (directory.path === this.current.path) this.trigger('refresh');
          this.trigger(
            'idle',
            `Renamed Folder ${folder.name} to ${name} in ${directory.name}`
          );
        }
      } catch (e) {
        if (signal && signal.aborted) {
          this.trigger('idle');
          return;
        }
        this.trigger('error', e.message);
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
