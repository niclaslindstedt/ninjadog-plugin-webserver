import Vue from 'vue';
import Router from 'vue-router';
import LoggerView from './views/LoggerView.vue';
import QbView from './views/QbView.vue';
import RssReaderView from './views/RssReaderView.vue';
import StartView from './views/StartView.vue';
import VersionsView from './views/VersionsView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView,
    },
    {
      path: '/qb',
      name: 'qb',
      component: QbView,
    },
    {
      path: '/rss',
      name: 'rss',
      component: RssReaderView,
    },
    {
      path: '/logger',
      name: 'logger',
      component: LoggerView,
    },
    {
      path: '/versions',
      name: 'versions',
      component: VersionsView,
    },
  ],
});
