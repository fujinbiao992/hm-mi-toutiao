import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const Search = () => import('@/views/search')
// const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
        { path: '/question', name: 'question', component: Question },
        { path: '/video', name: 'video', component: Video },
        { path: '/user', name: 'user', component: User }
      ]
    },
    { path: '/user/profile', name: 'user-profile', component: UserProfile },
    { path: '/user/chat', name: 'user-chat', component: UserChat },
    { path: '/login', name: 'login', component: Login },
    { path: '/search', name: 'search', component: Search },
    // { path: '/search/result', name: 'search-result', component: SearchResult },
    { path: '/article', name: 'article', component: Article }
  ]
})
// 设置导航守卫(拦截需要登录的页面访问)
// 以下这些页面需要被拦截掉(/user /user/profile /user/chat)
// 未登录的情况下,才需要被拦截住
router.beforeEach((to, from, next) => {
  const login = { path: '/login', query: { redirect: to.path } }
  if (to.path.startsWith('/user') && !store.state.user.token) return next(login)
  next()
})
export default router
