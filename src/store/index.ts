import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface State {
  searchText: string;
}

export default new Vuex.Store({
  state: {
    searchText: ''
  },
  getters: {
    searchText(state: State) {
      return state.searchText;
    }
  },
  actions: {
    changeText(
      { commit, state }: { commit: Function; state: State },
      paylod: any
    ) {
      commit('changeSearchText', paylod);
    },
    clearText({ commit }: { commit: Function; state: State }) {
      commit('clearSearchText');
    }
  },
  mutations: {
    changeSearchText(state: State, { searchText }) {
      state.searchText = searchText;
    },
    clearSearchText(state: State) {
      state.searchText = '';
    }
  }
});
