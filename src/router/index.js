import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

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
      meta: {isAuth: true, title: '商城后台管理系统'}
    }

  ]
})

router.beforeEach((to, from, next)=> {
  console.log(to, from)
  const tokenStr = window.sessionStorage.getItem('token'); 
  if(to.meta.isAuth) {
    // 没有token，强制跳转到登录
    if(!tokenStr) return next('/login')
    next()
  }
  next()
})


export default router
