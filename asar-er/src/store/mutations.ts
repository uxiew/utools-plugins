import { MutationTree } from 'vuex';
import State from './state';
import Types from './types';

type S = typeof State;

function resolveArray(arr: any[]): any[] {
  let res: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    Array.isArray(arr[i]) ? (res = [...res, ...resolveArray(arr[i])]) : res.push(arr[i]);
  }
  return res;
}

// const sort = (files: any) => {
//   const tempFolder = [];
//   const tempFile = [];
//   for (const [name, node] of Object.entries(files)) {
//     const { files } = node as AsarNode;
//     if (files) {
//       tempFolder.push({ title: file.title, data: node, indent: indent, key: curPath });
//       console.log(files);
//       tempFolder.push(name);
//     } else {
//       tempFile.push({ title: file.title, data: node, indent: indent, key: curPath });
//     }
//   }
//   return resolveArray();
// };

const mutations: MutationTree<S> = {
  [Types.SET_ASAR_PATH](state, path: string) {
    state.asarPath = path;
  },
  [Types.SET_TREE](state, asar: AsarNode) {
    // sort(asar.files);
    state.tree = asar;
  },
};

export default mutations;
