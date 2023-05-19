import { Kernel } from './Kernel';
import events, { EventSubscription } from '@mongez/events';
import { cache } from 'react';
import { TreeNode, Tree } from './KernelTree';

export type QueryEvent = 'query' | 'cd' | 'loading' | 'info' | 'idle' | 'error' ;

export class Query {
  public kernel: Kernel;

  public currentDirectory: TreeNode = null;

  protected queryUrl = (path: string) => `api/query/${path}`;


  constructor(kernel: Kernel) {
    this.kernel = kernel;
    this.currentDirectory = kernel.rootDirectory;
  }

  public updateKernel(kernel: Kernel) {
    this.kernel = kernel;
    this.currentDirectory = kernel.rootDirectory;
    //TODO: go back to current folder
  }

    /**
   * Initialises Query: Pinecone, OpenAIEmbeddings TODO: Expand
   * @param signal AbortSignal. Defaults to null
   */

    public init = cache(async (signal: AbortSignal = null): Promise<void> => {
        console.log('Initialised Query.init()');
    
        this.trigger('loading', 'query');

        this.trigger('info', 'Initialising...');
    
        try {
          let res = await fetch(this.queryUrl('init'), {
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
            data,
            error,
          }: {
            data: true | null;
            error: string | null;
          } = await res.json();
    
          console.log('Obtained Query.init() response');
    
          if (error || !data)
            throw new Error(error ?? 'Missing Query.init() response data');
          else {
            this.trigger('idle', 'Initialised Query');
          }
        } catch (e) {
          this.trigger('error', e.message);
          throw e;
        }
      });

  public changeDirectory(
    payload?: { key?: string; name?: string; start?: TreeNode },
    node?: TreeNode
  ) {
    if (!this.kernel.folderTree) return false;
    if (!payload && !node) return false;
    if (node) {
      this.currentDirectory = node;
      return false;
    }
    let { key, name, start } = payload;
    let result = this.kernel.folderTree.find({ key, name, start });

    if (result) {
      this.currentDirectory = node;
      return true;
    } else return false;
  }

  /**
   * Add event listener to the given event
   * @param event KernelEvent
   * @param callback any
   */
  public on(event: QueryEvent, callback: any): EventSubscription {
    return events.subscribe(`kernel.${event}`, callback);
  }

  /**
   * Trigger the given event
   * @param event KernelEvent
   * @param ...args any[]
   */
  public trigger(event: QueryEvent, ...args: any[]): void {
    events.trigger(`kernel.${event}`, ...args);
  }
}
