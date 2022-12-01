import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 路由重定向，自动跳转到Login
    { path: '/', redirect: '/login' },
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
        },
        // 角色列表组件
        {
          path: '/roles',
          component: Roles,
          meta: {title: '角色管理'}
        },
        // 权限列表组件
        { 
          path: '/rights',
          component: Rights,
          meta: {title: '权限管理'}
        },
        // 商品分类组件
        {
          path: '/categories',
          component: Cate,
          meta: {title: '商品分类'}
        },
        // 商品分类参数
        { 
          path: '/params',
          component: Params,
          meta: {title: '分类参数'}
        },
        // 商品列表
        {
          path: '/goods',
          component: GoodsList,
          meta: {title: '商品列表'}
        },
        // 添加商品
        {path: '/add', component: Add, meta: {title: '添加商品'}},
        // 订单管理
        {
          path: '/orders',
          component: Order,
          meta: {title: '订单管理'}
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
