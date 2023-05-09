import { PropType } from 'lib/types';
import { Directory, Folder } from './Folder';

export class TreeNode {
  key: PropType<Folder, 'path'> = null;
  folder: Folder = null;
  parent: TreeNode = null;
  folders: { [k: PropType<TreeNode, 'key'>]: TreeNode } = null;
  directories: { [k: PropType<TreeNode, 'key'>]: TreeNode } = null;

  constructor(folder: Folder, parent = null) {
    this.key = folder.path;
    this.folder = folder;
    this.parent = parent;
    this.folders = {};
    this.directories = {};
  }

  get isRoot() {
    return this.parent == null
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

  constructor(rootDirectory: Directory) {
    this.root = new TreeNode(rootDirectory);
  }

  *levelOrderTraversal(
    node = this.root,
    folderType = null as null | 'folders' | 'directories'
  ) {
    yield node;
    var q = [] as TreeNode[];

    q.push(node);

    while (q.length != 0) {
      var n = q.length;
      while (n > 0) {
        var p = q[0];

        q.shift();

        if (folderType == null || (folderType == 'folders' && !p.folder.isDirectory) ||
          (folderType == 'directories' && p.folder.isDirectory)
        )
          yield p;

        let children = Object.values(p.children);

        for (var i = 0; i < children.length; i++) q.push(children[i]);
        n--;
      }
    }
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
        // reset before adding children
        node.directories = {}
        node.folders = {}
        for (let folder of folders) {
          if (folder.isDirectory) {
            node.directories = {
              ...node.directories,
              [folder.path]: new TreeNode(folder, node),
            };
          } else {
            node.folders = {
              ...node.folders,
              [folder.path]: new TreeNode(folder, node),
            };
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
        delete node.folders[key];
        return true;
      } else if (Object.keys(node.directories).includes(key)) {
        delete node.directories[key];
        return true;
      }
    }
    return false;
  }

  find(payload: {key?: string, name?: string, start?: TreeNode }): TreeNode | undefined {
    const { key, name, start = this.root } = payload
    if (!key && !name) return undefined
    for (let node of this.preOrderTraversal(start)) {
      if (node.key === key) return node;
      else if (name && node.folder.name == name) return node;
    }
    return undefined;
  }

  flatten(node = this.root, folderType = null as null | 'folders' | 'directories') {
    let result = [] as TreeNode[];

    for (let n of this.levelOrderTraversal(node, folderType)) result.push(n);

    return result;
  }
}
