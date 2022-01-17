import { MutationTree } from 'vuex';
import State from './state';
import Types from './types';

type S = typeof State;

function renderAsarNode(data: any, name = '/'): FBAsar[] {
  const asarFiles: FBAsar[] = [];
  const nodeFiles: any = data.files;
  const dirArr: FBAsar[] = [];

  nodeFiles
    ? Object.keys(nodeFiles).forEach((fname: string) => {
        const data = nodeFiles[fname];
        if (data.files) {
          const files = renderAsarNode(data, fname);
          dirArr.push({
            name: fname,
            type: 'directory',
            files,
          });
        } else {
          asarFiles.push({
            name: fname,
            type: 'file',
            hash: data.offset,
            size: data.size,
          });
        }
      })
    : asarFiles.push({
        name,
        type: 'file',
        hash: data.offset,
        size: data.size,
      });

  return [...dirArr, ...asarFiles];
}

const mutations: MutationTree<S> = {
  [Types.SET_ASAR_PATH](state, path: string) {
    state.asarPath = path;
  },
  [Types.SET_TREE](state, asar: AsarNode) {
    state.tree = renderAsarNode(asar);
  },
};

export default mutations;
