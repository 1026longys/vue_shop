import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 路由重定向，自动跳转到Login
    { path: '/', redirect: '/Login' },
    { 
      path: '/login', 
      component: Login,
      meta: {title: '登录'}
    },
    { 
      path: '/home', 
      component: Home,
      redirect: '/welcome',
      meta: {isAuth: true, title: '商城后台管理系统'},
      children: [
        // 欢迎组件
        { path: '/welcome', component: Welcome},
        // 用户列表组件
        {
          path: '/users',
          component: User,
          meta: {title: '用户列表'},
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next)=> {
  // console.log(to, from)
  const tokenStr = window.sessionStorage.getItem('token'); 
  if(to.meta.isAuth) {
    // 没有token，强制跳转到登录
    if(!tokenStr) return next('/login')
    next()
  }
  next()
})


export default router
