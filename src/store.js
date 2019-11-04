import Vue from 'vue'
import Vuex from 'vuex'
// import * as auth from '@/utils/auth'
import * as auth from '@/utils/auth'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 保存用户信息
    user: auth.getUser()
  },
  mutations: {
    // 存储用户信息
    setUser (state, user) {
      state.user = user
      // 更新本地存储
      auth.setUser(user)
    },
    // 清除用户信息
    delUser (state) {
      // 更新state状态
      state.user = {}
      // 更新本地存储
      auth.delUser()
    }
  },
  actions: {

  }
})
