import { PropType } from 'lib/types';
import { Folder } from './Folder';

export class TreeNode {
  key: PropType<Folder, 'path'> = null;
  folder: Folder = null;
  parent: Folder = null;
  folders: { [k: PropType<TreeNode, 'key'>]: TreeNode } = null;
  directories: { [k: PropType<TreeNode, 'key'>]: TreeNode } = null;

  constructor(folder: Folder, parent = null) {
    this.key = folder.path;
    this.folder = folder;
    this.parent = parent;
    this.folders = {}
    this.directories = {}
  }

  get isLeaf() {
    return Object.entries(this.children).length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }

  get children() {
    return { ...this.folders, ...this.directories };
  }

}

export class Tree {
  root: TreeNode = null;

  constructor(key: string, folder: Folder) {
    this.root = new TreeNode(folder);
  }

  *preOrderTraversal(node = this.root) {
    yield node;

    let nodes = Object.values(node.children);

    if (nodes.length) {
      for (let child of nodes) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      let nodes = Object.values(node.children);
      for (let child of nodes) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey: string, folders: Folder[]) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        for (let folder of folders) {

          if (folder.isDirectory) {
            node.directories = {
              ...node.directories,
              [folder.path]: new TreeNode(folder, node),
            }
          }

          else {
            node.folders = {
              ...node.folders,
              [folder.path]: new TreeNode(folder, node),
            }
          }
        }
        return true;
      }
    }
    return false;
  }

  remove(key: string) {
    for (let _node of this.preOrderTraversal()) {
      let node = _node as TreeNode;

      if (Object.keys(node.folders).includes(key)) {
        delete node.folders[key]
        return true
      }

      else  if (Object.keys(node.directories).includes(key)) {
        delete node.directories[key]
        return true
      }
    }
    return false;
  }

  find(key: string): TreeNode | undefined {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}
