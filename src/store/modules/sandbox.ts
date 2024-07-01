import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import { SandBoxState } from '@/store/getters'
import Utils from '@/utils/utils'
import request from '@/utils/request.js'
import { Message } from '@lui/lui-ui'
import { ISandbox } from '@/api/module/types/sandbox'

@Module({ dynamic: true, store, name: 'SandBoxModule' })

class SandBox extends VuexModule implements SandBoxState {
  apiList: ISandbox.SelectApiListByCategoryItem[] = [];
  @Mutation
  public CHANGE_APILIST(newList: ISandbox.SelectApiListByCategoryItem[]) {
    this.apiList = newList;
  }

}

export const SandBoxModule = getModule(SandBox)
