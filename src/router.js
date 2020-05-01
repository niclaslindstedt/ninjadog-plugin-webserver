import Vue from 'vue';
import Router from 'vue-router';

import StartView from './views/StartView.vue';
import QbittorrentView from './views/QbittorrentView.vue';
import TorrentrssView from './views/TorrentrssView.vue';
import KodiView from './views/KodiView.vue';
import LoggerView from './views/LoggerView.vue';
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
      path: '/qbittorrent',
      name: 'qbittorrent',
      component: QbittorrentView,
    },
    {
      path: '/torrentrss',
      name: 'torrentrss',
      component: TorrentrssView,
    },
    {
      path: '/kodi',
      name: 'kodi',
      component: KodiView,
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
