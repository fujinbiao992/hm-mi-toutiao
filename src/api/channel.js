import request from '@/utils/request'

/* eslint-disable no-undef */
// 提供频道相关结构调用的函数
// 获取我的频道信息(如果在没有登录的清空下,获取后台这只的默认频道列表)
export const getMyChannels = () => {
  return request('app/v1_0/user/channels', 'get')
}
