import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'
import Vue from "vue";
Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreModel {
  selectedCategory: server.Group | null,
  searchedValue: string,
  selectedTask: server.Task | null,
  states: { [groupId: string]: server.State[] },
  groups: server.Group[],
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreGetters {
  getSelectedCategory(): server.Group | null;
  getSearchedValue(): string;
  getSelectedTask(): string;
  getStates(groupId: string): server.State[];
  getGroups(): server.Group[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreActions {
  setSelectedCategory(value: server.Group | null): void;
  setSearchedValue(value: string): void;
  setSelectedTask(value: server.Task | null): void;
  setStates(model: { groupId: string, states: server.State[] }): void;
}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {
    selectedCategory: null,
    searchedValue: '',
    selectedTask: null,
    groups: [],
    states: {}
  } as CrowdplanningStoreModel,
  getters: {
    getSelectedCategory: (state) => () => state.selectedCategory,
    getSearchedValue: (state) => () => state.searchedValue,
    getSelectedTask: (state) => () => state.selectedTask,
    getStates: (state) => (groupId: string) => state.states[groupId]
  } as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {
    SET_SELECTED_CATEGORY(state: CrowdplanningStoreModel, model: server.Group) {
      state.selectedCategory = model;
    },
    SET_SEARCHED_VALUE(state: CrowdplanningStoreModel, model: string) {
      state.searchedValue = model;
    },
    SET_SELECTED_TASK(state: CrowdplanningStoreModel, model: server.Task) {
      state.selectedTask = model;
    },
    SET_STATES(state: CrowdplanningStoreModel, model: { groupId: string, states: server.State[] }) {
      state.states[model.groupId] = model.states;
    }
  },
  actions: {
    setSelectedCategory(context, model: server.Group): void {
      context.commit("SET_SELECTED_CATEGORY", model);
    },
    setSearchedValue(context, model: string): void {
      context.commit("SET_SEARCHED_VALUE", model);
    },
    setSelectedTask(context, model: server.Task): void {
      context.commit("SET_SELECTED_TASK", model);
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
