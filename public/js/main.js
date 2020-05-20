import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Api from './api.js';
import App from './App.js';
import routes from './routes.js';
const _api = new Api();

Vue.prototype.$http = axios;
Vue.prototype.$api = _api;

const router = new VueRouter({
  routes: routes,
});

new Vue({
  data: { Api: _api },
  router,
  render: (h) => h(App),
}).$mount('#app');
