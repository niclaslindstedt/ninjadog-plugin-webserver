import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

import './scss/style.scss';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = `http://localhost:8585`;
}

import Api from './api.js';
const _api = new Api();

Vue.prototype.$http = axios;
Vue.prototype.$api = _api;

new Vue({
  router,
  data: { Api: _api },
  render: h => h(App),
}).$mount('#app');
