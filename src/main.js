import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vant.js'
import VueCookies from 'vue-cookies'
import axios from 'axios'
Vue.use(VueCookies)

Vue.config.produc

axios.defaults.withCredentials
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
