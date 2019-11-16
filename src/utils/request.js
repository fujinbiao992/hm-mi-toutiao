import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 设置响应拦截(成功,剔除无用的数据,失败,则刷新token)
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [data => {
    // 修改格式
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 设置请求拦截
instance.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 响应拦截(成功,无用数据 失败,重新刷新token)
instance.interceptors.response.use(res => {
  // console.log(res)
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, async err => {
  // TODO 处理token失效
  // 1. 只有401状态  才需要去刷新token
  if (err.response && err.response.status === 401) {
    // 2. 401出现（失效，本地不存在，未登录）
    const user = store.state.user
    // 提供跳转登录页面的配置对象  方便使用参数
    const login = { path: '/login', query: { redirect: router.currentRoute.path } }
    if (!user.token || !user.refresh_token) {
      // 去登录
      router.push(login)
      return Promise.reject(err)
    }
    try {
      // 3. (axios实例)发送刷新token的请求  异步操作
      // instance 在头部携带是 token 已经给你配置完毕
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 刷新token成功
      // 4. 更新 vuex 和 本地token
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // 5. 把错误的请求发出去
      // 发请求需要：instance({请求配置})  请求配置：err.config 对象错误请求的配置
      return instance(err.config)
    } catch (e) {
      // 刷新token失败
      // 删除 token 信息
      store.commit('delUser')
      // 跳转登录
      router.push(login)
      return Promise.reject(err)
    }
  }
  return Promise.reject(err)
})
export default (url, method, data) => {
  return instance({
    url,
    method,
    // params: data,
    // data: data
    // key是否可以使用变量
    // method 写法  GET get Get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
