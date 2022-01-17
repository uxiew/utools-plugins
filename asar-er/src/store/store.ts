import store from './index';
import Types from './types';

export function setAsarPath(path: string): void {
  store.commit(Types.SET_ASAR_PATH, path);
}

export function setTree(tree: AsarNode): void {
  store.commit(Types.SET_TREE, tree);
}

export const getters = {
  asarPath(): string {
    return store.state.asarPath;
  },
  tree: {
    get(): FBAsar[] {
      return store.state.tree;
    },
    set(v: AsarNode): void {
      setTree(v);
    },
  },
};
