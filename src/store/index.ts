import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'
import Vue from "vue";
Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreModel {
  selectedCategory: server.Group | null,
  searchedValue: string,
  selectedPlan: server.Plan | null,
  states: { [groupId: string]: server.State[] },
  groups: server.Group[],
  plans: server.Plan[],
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreGetters {
  getSelectedCategory(): server.Group | null;
  getSearchedValue(): string;
  getSelectedPlan(): string;
  getStates(groupId: string): server.State[];
  getGroups(): server.Group[];
  getGroupById(id: string): server.Group | null;
  getPlans(): server.Plan[];
  getPlanById(id: string): server.Plan;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreActions {
  setSelectedCategory(value: server.Group | null): void;
  setSearchedValue(value: string): void;
  setSelectedPlan(value: server.Plan | null): void;
  setStates(model: { groupId: string, states: server.State[] }): void;
  setState(model: { state: server.State, groupId: string }): void;
  setPlans(model: server.Plan[]): void;
  setGroups(model: server.Group[]): void;
  deleteGroup(model: string): void;
  deletePlan(model: string): void;
  setPlan(model: server.Plan): void;
  setGroup(model: server.Group): void;
}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {
    selectedCategory: null,
    searchedValue: '',
    selectedPlan: null,
    groups: [],
    states: {},
    plans: []
  } as CrowdplanningStoreModel,
  getters: {
    getSelectedCategory: (state) => () => state.selectedCategory,
    getSearchedValue: (state) => () => state.searchedValue,
    getSelectedTask: (state) => () => state.selectedPlan,
    getStates: (state) => (groupId: string) => state.states[groupId],
    getPlans: (state) => () => state.plans,
    getGroups: (state) => () => state.groups,
    getGroupById: (state) => (id: string) => state.groups.find(x => x.id === id),
    getPlanById: (state) => (id: string) => state.plans.find(x => x.id === id)
  } as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {
    SET_SELECTED_CATEGORY(state: CrowdplanningStoreModel, model: server.Group) {
      state.selectedCategory = model;
    },
    SET_SEARCHED_VALUE(state: CrowdplanningStoreModel, model: string) {
      state.searchedValue = model;
    },
    SET_SELECTED_PLAN(state: CrowdplanningStoreModel, model: server.Plan) {
      state.selectedPlan = model;
    },
    SET_STATES(state: CrowdplanningStoreModel, model: { groupId: string, states: server.State[] }) {
      Vue.set(state.states, model.groupId, model.states);
    },
    SET_STATE(state: CrowdplanningStoreModel, model: { state: server.State, groupId: string }) {
      const states = [...state.states[model.groupId]];

      const idx = states.findIndex(x => x.id === model.state.id);

      if (idx !== -1) {
        states[idx] = model.state;
      } else {
        states.push(model.state);
      }

      Vue.set(state.states, model.groupId, states);
    },
    SET_PLANS(state: CrowdplanningStoreModel, model: server.Plan[]) {
      state.plans = model;
    },
    SET_GROUPS(state: CrowdplanningStoreModel, model: server.Group[]) {
      state.groups = model;
    },
    DELETE_GROUP(state: CrowdplanningStoreModel, model: string) {
      const idx = state.groups.findIndex(x => x.id === model);

      if (idx !== -1)
        state.groups = state.groups.splice(idx, 1);
    },
    SET_GROUP(state: CrowdplanningStoreModel, model: server.Group) {
      const idx = state.groups.findIndex(x => x.id === model.id);

      if (idx !== -1)
        state.groups = [...state.groups, state.groups[idx] = model];
    },
    DELETE_PLAN(state: CrowdplanningStoreModel, model: string) {
      const idx = state.plans.findIndex(x => x.id === model);

      if (idx !== -1)
        state.plans = state.plans.splice(idx, 1);
    },
    SET_PLAN(state: CrowdplanningStoreModel, model: server.Plan) {
      const idx = state.plans.findIndex(x => x.id === model.id);

      if (idx !== -1)
        state.plans = [...state.plans, state.plans[idx] = model];
    }
  },
  actions: {
    setSelectedCategory(context, model: server.Group): void {
      context.commit("SET_SELECTED_CATEGORY", model);
    },
    setSearchedValue(context, model: string): void {
      context.commit("SET_SEARCHED_VALUE", model);
    },
    setSelectedPlan(context, model: server.Plan): void {
      context.commit("SET_SELECTED_PLAN", model);
    },
    setStates(context, model: { groupId: string, states: server.State[] }): void {
      context.commit("SET_STATES", model);
    },
    setState(context, model: { state: server.State, groupId: string }): void {
      context.commit("SET_STATE", model);
    },
    setPlans(context, model: server.Plan[]): void {
      context.commit("SET_PLANS", model);
    },
    setGroups(context, model: server.Group[]): void {
      context.commit("SET_GROUPS", model);
    },
    deletePlan(context, model: string): void {
      context.commit("DELETE_PLAN", model);
    },
    setPlan(context, model: server.Plan): void {
      context.commit("SET_PLAN", model);
    },
    deleteGroup(context, model: string): void {
      context.commit("DELETE_GROUP", model);
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
