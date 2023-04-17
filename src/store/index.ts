import Vuex, { ActionTree, GetterTree, Store } from 'vuex'
import { CreateTypedStoreProxy } from 'vuex-typed-store'

export interface CrowdplanningStoreModel {}

export interface CrowdplanningStoreGetters {} 

export interface CrowdplanningStoreActions {}

export const crowdplanningStore = {
  PREFIX: "crowdplanning",
  namespaced: true,
  state: {} as CrowdplanningStoreModel,
  getters: {} as GetterTree<CrowdplanningStoreModel, CrowdplanningStoreModel>,
  mutations: {},
  actions: {} as ActionTree<CrowdplanningStoreModel, any>
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

export const vuestore: Store<any> = new Vuex.Store({
  modules: { [crowdplanningStore.PREFIX]: crowdplanningStore }
});

export const store = CreateTypedStoreProxy<StoreModel, StoreActions, StoreGetters>(vuestore);
