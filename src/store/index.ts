import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'
import Vue from "vue";
Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreModel {
  selectedCategory: server.Group | null,
  searchedValue: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreGetters {
  getSelectedCategory(): server.Group | null;
  getSearchedValue(): string;
} 

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreActions {
  setSelectedCategory(value: server.Group | null): void;
  setSearchedValue(value: string): void;
}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {
    selectedCategory: null,
    searchedValue: ''
  } as CrowdplanningStoreModel,
  getters: {
    getSelectedCategory: (state) => () => state.selectedCategory,
    getSearchedValue: (state) => () => state.searchedValue
  } as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {
    SET_SELECTED_CATEGORY(state: CrowdplanningStoreModel, model: server.Group) {
      state.selectedCategory = model;
    },
    SET_SEARCHED_VALUE(state: CrowdplanningStoreModel, model: string) {
      state.searchedValue = model;
    }
  },
  actions: {
    setSelectedCategory(context, model: server.Group): void {
      context.commit("SET_SELECTED_CATEGORY", model);
    },
    setSearchedValue(context, model: string): void {
      context.commit("SET_SEARCHED_VALUE", model);
    }
  } as ActionTree<CrowdplanningStoreModel, unknown>
};

interface StoreModel {
  crowdplanning: CrowdplanningStoreModel
}

interface StoreActions {
  crowdplanning: CrowdplanningStoreActions
}

interface StoreGetters {
  crowdplanning: CrowdplanningStoreGetters
}

export const vuestore: Store<unknown> = new Vuex.Store({
  modules: { [crowdplanningStore.PREFIX]: crowdplanningStore }
});

export const store = CreateTypedStoreProxy<StoreModel, StoreActions, StoreGetters>(vuestore);
