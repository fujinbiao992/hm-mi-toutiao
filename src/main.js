import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
//  rem基准值的插件
import 'amfe-flexible'
import '@/styles/index.less'
// 使用自己的插件
import plugin from '@/utils/plugin'
Vue.use(Lazyload)
Vue.use(plugin)
Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
