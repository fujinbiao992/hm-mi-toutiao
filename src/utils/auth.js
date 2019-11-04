const AUTH_KEY = 'hm-toutiao-m-80-user'
// 获取
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(AUTH_KEY || '{}'))
}
// 设置user是一个对象
export const setUser = (user) => {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}
// 清除
export const delUser = () => {
  window.localStorage.removeItem(AUTH_KEY)
}
