import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/fonts/iconfont.css'
import './assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
import dayjs from 'dayjs'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入 NProgress 对应的 js 和 css 包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// 配置请求根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// request 拦截器  展示进度条
axios.interceptors.request.use(config=> {
  // console.log(config)
  NProgress.start();
  // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  // 最后必须 return config
  return config
})
// 在 response 拦截器中隐藏进度条
axios.interceptors.response.use(config=> {
  NProgress.done();
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 全局时间过滤器
Vue.filter('dataFormat', function(value, str='YYYY-MM-DD HH:mm:ss') {
  return dayjs(value).format(str)
});
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
