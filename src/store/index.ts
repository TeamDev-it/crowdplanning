import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreGetters {} 

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CrowdplanningStoreActions {}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {} as CrowdplanningStoreModel,
  getters: {} as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {},
  actions: {} as ActionTree<CrowdplanningStoreModel, unknown>
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
