import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'cesium/Widgets/widgets.css'
import '@/assets/icon/iconfont.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Antd);

// eslint-disable-next-line no-undef
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDE4MjM1Zi1lZWZkLTQyNTktOWZhZS0xYjlhZTZkNTFkNmUiLCJpZCI6NzMwNDAsImlhdCI6MTYzNjU0MjMxMX0.ouBR3MBCYGhFrq4IaHGNGlBWrOrDUH-ddz6ef2yI92k'

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
