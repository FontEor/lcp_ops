import Vue from 'vue'
import Vuex from 'vuex'
import { IUserState, SappState } from '@/store/getters'

Vue.use(Vuex)

export interface TRootState {
  user: IUserState,
  app: SappState
}

export default new Vuex.Store<TRootState>({})
