import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface State {
  searchText: string;
  pkgInfo: object;
}

export default new Vuex.Store({
  state: {
    searchText: '',
    pkgInfo: {}
  },
  getters: {
    searchText(state: State) {
      return state.searchText;
    },
    pkgInfo(state: State) {
      return state.pkgInfo;
    }
  },
  actions: {
    changeText({ commit }: { commit: Function }, paylod: any) {
      commit('changeSearchText', paylod);
    },
    savePkg({ commit }: { commit: Function }, paylod: any) {
      commit('savePkgInfo', paylod);
    },
    clearText({ commit, state }: { commit: Function; state: State }) {
      commit('clearSearchText');
    }
  },
  mutations: {
    savePkgInfo(state: State, pkgInfo) {
      state.pkgInfo = pkgInfo;
    },
    changeSearchText(state: State, { searchText }) {
      state.searchText = searchText;
    },
    clearSearchText(state: State) {
      state.searchText = '';
    }
  }
});
