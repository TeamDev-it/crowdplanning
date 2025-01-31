import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'
import Vue from "vue";
import { cloneDeep } from 'lodash';
Vue.use(Vuex);


export interface CrowdplanningStoreModel {
  // selectedGroup: server.Group | null,
  searchedValue: string,
  // selectedPlanId: string | null,
  states: { [groupId: string]: server.State[] },
  groups: server.Group[],
  plans: server.Plan[],
}

export interface CrowdplanningStoreGetters {
  getSearchedValue(): string;
  getStates(groupId: string): server.State[];
  getGroups(): server.Group[];
  getGroupById(id: string): server.Group | null;
  getRootGroup(): server.Group;
  getPlans(): server.Plan[];
  getPlanById(id: string): server.Plan;
  getChildrenOfPlan(id: string): server.Plan[];
  //  getSelectedGroup(): server.Group | null;
  //  getSelectedPlanId(): string;
}


export interface CrowdplanningStoreActions {
  setSearchedValue(value: string): void;
  setStates(model: { groupId: string, states: server.State[] }): void;
  setState(model: { state: server.State, groupId: string }): void;
  setPlans(model: server.Plan[]): void;
  setGroups(model: server.Group[]): void;
  deleteGroup(model: string): void;
  deletePlan(model: string): void;
  setPlan(model: server.Plan): void;
  setGroup(model: server.Group): void;
  //  setSelectedPlanId(value: string | null): void;
  //  setSelectedCategory(value: server.Group | null): void;
}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {
    //  selectedGroup: null,
    searchedValue: '',
    //  selectedPlanId: null,
    groups: [],
    states: {},
    plans: []
  } as CrowdplanningStoreModel,
  getters: {
    getSearchedValue: (state) => () => state.searchedValue,
    getStates: (state) => (groupId: string) => state.states[groupId],
    getPlans: (state) => () => state.plans,
    getGroups: (state) => () => state.groups,
    getGroupById: (state) => (id: string) => state.groups.find(x => x.id === id),
    getRootGroup: (state) => () => state.groups.filter(x => !x.parentGroupId)[0],
    getPlanById: (state) => (id: string) => state.plans.find(x => x.id === id),
    getChildrenOfPlan: (state) => (id: string) => state.plans.filter(x => x.parentId === id)
  } as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {
    SET_SEARCHED_VALUE(state: CrowdplanningStoreModel, model: string) {
      state.searchedValue = model;
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
        state.groups.splice(idx, 1);
    },
    SET_GROUP(state: CrowdplanningStoreModel, model: server.Group) {
      const idx = state.groups.findIndex(x => x.id === model.id);

      if (idx !== -1)
        state.groups[idx] = { ...model };
      else {
        state.groups.push(model)
      }
    },
    DELETE_PLAN(state: CrowdplanningStoreModel, model: string) {
      const idx = state.plans.findIndex(x => x.id === model);

      if (idx !== -1)
        state.plans.splice(idx, 1);
    },
    SET_PLAN(state: CrowdplanningStoreModel, model: server.Plan) {
      const idx = state.plans.findIndex(x => x.id === model.id);

      if (idx !== -1) {
        const updatedPlans = [...state.plans];

        updatedPlans[idx] = model;

        state.plans = updatedPlans;
      }
      else {
        state.plans.push(model);
      }
    }
  },
  actions: {

    setSearchedValue(context, model: string): void {
      context.commit("SET_SEARCHED_VALUE", model);
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
    },
    setGroup(context, model: server.Group): void {
      context.commit("SET_GROUP", model);
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
