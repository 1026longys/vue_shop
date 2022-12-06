import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')

// import User from './components/user/User.vue'
const User = () => import(/* webpackChunkName:"user" */ '../components/user/User.vue')

// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import GoodsList from './components/goods/List.vue'
const GoodsList = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/Order.vue')
// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report.vue')

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
        },
        // 数据统计
        {
          path: '/reports',
          component: Report,
          meta: {title: '数据报表'}
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

router.afterEach((to, from, next) => {
    // console.log('后置路由守卫', to, from)
    document.title = to.meta.title+'——电商后台管理系统' || '电商后台管理系统'
})

export default router
