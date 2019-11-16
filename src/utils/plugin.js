// 提供一个基于vue的插件,包含,工具函数,过滤器,自定义指令
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
// 阻碍程序运行,阻止一秒就可以
const sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}

// 创建过滤器函数
const relTime = (strDate) => {
  // 根据dayjs插件来进行转换,dayjs插件,转换的都是时间格式
  // return dayjs().locale('zh-c').from(strDate)
  return dayjs().locale('zh-cn').from(strDate)
}
// 导出
export default {
  install (Vue) {
    // 做基于Vue的代码
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime)
  }
}
