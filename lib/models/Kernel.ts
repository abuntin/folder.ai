import { Directory, Folder } from '.';
import { cache } from 'react';
import _ from 'lodash';
import events, { EventSubscription } from '@mongez/events';
import axios from 'axios';
import { Tree, TreeNode } from './KernelTree';
import { PropType } from 'lib/types';
import { LoadingType } from 'components/app';

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
  | 'info'
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
  public currentDirectory: TreeNode = null;

  public rootDirectory: TreeNode = null;

  public folderTree: Tree = null;

  protected prevDirectory: TreeNode = null;

  protected folderManagerUrl = (path: string) => `api/folder-manager/${path}`;

  public get isRoot() {
    return this.currentDirectory
      ? this.currentDirectory.key === this.rootDirectory.key
      : false;
  }

  public get folders() {
    return this.folderTree
      ? this.folderTree.flatten(this.currentDirectory)
      : [];
  }

  public get foldersExcl() {
    return this.folderTree
      ? this.folderTree.flatten(this.currentDirectory, 'folders')
      : [];
  }

  public get directoriesExcl() {
    return this.folderTree
      ? this.folderTree.flatten(this.currentDirectory, 'directories')
      : [];
  }

  public get currentFoldersExcl() {
    return Object.values(
      this.currentDirectory ? this.currentDirectory.folders : {}
    );
  }

  public get currentDirectoriesExcl() {
    return Object.values(
      this.currentDirectory ? this.currentDirectory.directories : {}
    );
  }

  public get currentFolders() {
    return Object.values(
      this.currentDirectory
        ? {
            ...this.currentDirectory.folders,
            ...this.currentDirectory.directories,
            [this.currentDirectory.key]: this.currentDirectory,
          }
        : {}
    );
  }

  /**
   * Gets root Folder from Firebase Storage TODO: Expand with user ID
   * @param signal AbortSignal. Defaults to null
   */

  public init = cache(async (signal: AbortSignal = null): Promise<void> => {
    console.log('Initialised Kernel.getRootFolder()');

    this.trigger('loading', 'folders');

    this.trigger('info', 'Initialising...');

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
      } = await res.json();

      console.log('Obtained Kernel.getRootFolder() response');

      if (error || !rootDirectory)
        throw new Error(error ?? 'Missing Kernel.init() response data');
      else {
        let tree = new Tree(rootDirectory);
        this.folderTree = tree;
        this.rootDirectory = tree.root;
        this.currentDirectory = tree.root;
        this.trigger('idle', 'Obtained root folder');
      }
    } catch (e) {
      this.trigger('error', e.message);
      throw e;
    }
  });

  /**
   * List the given Directory children
   */
  public list = cache(
    async (
      directory: Directory,
      signal: AbortSignal = null
    ): Promise<{ folders: Folder[]; directories: Directory[] }> =>
      new Promise(async (resolve, reject) => {
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

          console.log('Obtained Kernel.list() response');

          const {
            data,
            error,
          }: {
            data: {
              folders: Folder[];
              directories: Directory[];
            } | null;
            error: string | null;
          } = await res.json();

          if (error || !data)
            throw new Error(error ?? 'Missing Kernel.load() response data');
          else {
            const { folders, directories } = data;
            resolve({ folders, directories });
          }
        } catch (e) {
          reject(e.message);
        }
      })
  );
  /**
   * Load the given Directory onto kernel
   */
  public load = cache(
    async (
      key: PropType<Folder, 'path'>,
      type: LoadingType = 'folders',
      navigate = false,
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.load()');
      try {
        this.trigger('loading', type);

        let directoryNode = this.folderTree.find({key});

        if (!directoryNode)
          throw new Error('Cannot find Directory to load in Tree');

        let directory = directoryNode.folder;

        this.trigger('info', `Opening ${directory.name}...`);

        let data = await this.list(directory, signal);

        console.log('Obtained Kernel.load() response');

        if (!data) throw new Error('Missing Kernel.load() response data');
        else {
          const { folders, directories } = data;

          // Append children to Kernel

          this.folderTree.insert(directory.path, folders.concat(directories));

          if (navigate && this.currentDirectory.key !== directory.path) {
            let temp = this.currentDirectory;
            this.currentDirectory = this.folderTree.find({ key: directory.path });
            !this.isRoot && (this.prevDirectory = temp);
          }

          this.trigger('idle', `Opened Directory ${directory.name}`);
        }
      } catch (e) {
        this.trigger('error', e.message);
        this.trigger('idle');
      }
    }
  );

  /**
   * Goes back to prev Directory
   */

  public goBack = cache(async () => {
    !this.currentDirectory.isRoot
      ? this.load(this.currentDirectory.parent.key, 'folders', true)
      : null;
  });

  /**
   * Refreshes the current  Directory
   */

  public refresh = cache(async () => {
    if (!this.currentDirectory) return;

    return this.load(this.currentDirectory.key);
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
      const { directory, files: _files } = payload;

      console.log('Initialised Kernel.upload()');

      try {

        let buffers = {} as { [name: string]: Promise<ArrayBuffer> }

        let files = _files.reduce(
          (prev, curr) => {
            buffers = { ...buffers, [curr.name]: curr.arrayBuffer() }
            return { ...prev, [curr.name]: curr.type }
          },
          {} as { [name: string]: string }
        );

        this.trigger(
          'info',
          `Uploading ${
            Object.keys(files).length === 1
              ? Object.entries(files)[0][0]
              : `${Object.keys(files).length} files`
          } to ${directory.name}...`
        );

        // Get Presigned URLs

        const presignedResult = await fetch(this.folderManagerUrl('upload'), {
          method: 'POST',
          body: JSON.stringify({
            files,
            directory,
            type: 'upload',
          }),
          signal,
        });

        let {
          data,
          error,
        }: {
          data: { urls: { [name: string]: string } };
          error: string;
        } = await presignedResult.json();

        if (error || !data)
          throw new Error(error ?? 'Missing presigned response data');

        console.log(data.urls);

        let urls = Object.entries(data.urls);

        for (let [name, url] of urls) {
          let type = files[name];

          let buffer = Buffer.from(await buffers[name])

          let uploadResult = await fetch(url, {
            method: 'PUT',
            body: buffer,
            headers: {
              'Content-Type': type,
              'Origin': 'http://localhost:3000',
              'Access-Control-Request-Method': 'PUT',
              'Access-Control-Request-Headers': 'Content-Type'
            }
          });

          if (uploadResult.status != 200) console.log(uploadResult.statusText)
        }

        this.trigger(
          'idle',
          `Uploaded ${
            Object.keys(files).length === 1
              ? Object.entries(files)[0][0]
              : `${Object.keys(files).length} files`
          } to ${directory.name}`
        );

        if (this.currentDirectory.key == directory.path)
          this.trigger('refresh');
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
          'info',
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
        } = await res.json();

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
          'info',
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
        } = await res.json();

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
        this.trigger('info', `Deleting ${folders.length} Folders...`);

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
        } = await res.json();

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.delete() response data');
        else {
          this.trigger('cut', []);
          this.trigger('refresh');
          this.trigger(
            'error',
            `Deleted ${
              folders.length === 1
                ? folders[0].name
                : `${folders.length} Folders`
            }`
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
   * Create new Directory in specified Directory (default this.currentDirectory)
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
        const { name, directory = this.currentDirectory.folder } = payload;

        this.trigger(
          'info',
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
          if (directory.path === this.currentDirectory.key)
            this.trigger('refresh');
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
   * Rename Foldre in specified Directory (default this.currentDirectory)
   * @param payload { folder: Folder, name: string, directory: Directory }
   */

  public rename = cache(
    async (
      payload: { name: string; folder: Folder; directory: Directory },
      signal: AbortSignal = null
    ): Promise<void> => {
      console.log('Initialised Kernel.create()');

      try {
        const {
          name,
          folder,
          directory = this.currentDirectory.folder,
        } = payload;

        this.trigger(
          'info',
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
        } = await res.json();

        if (error || !data)
          throw new Error(error ?? 'Missing Kernel.rename() response data');
        else {
          if (directory.path === this.currentDirectory.key)
            this.trigger('refresh');
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
