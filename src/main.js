import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 请求基准路径配置
axios.defaults.baseURL = 'http://localhost:8888/api'
// 将axios添加到Vue的原型中 $http为自己取的名称
// 在别的组件中使用this.$http可以直接调用axios
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到Vue的原型上
// 别的组件中通过 this.$echarts 访问 echarts 对象
Vue.prototype.$echarts = window.echarts

// 关闭Vue的生产提示
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
