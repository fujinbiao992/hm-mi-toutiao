// 用户相关的api调用
import request from '@/utils/request'
export const login = ({ mobile, code }) => { // 调用request函数 得到一个promise的对象
  // console.log(mobile, code)
  return request('/app/v1_0/authorizations', 'post', { mobile, code })
}
