import Vue from 'vue';
import Router from 'vue-router';
import KodiView from './views/KodiView.vue';
import LoggerView from './views/LoggerView.vue';
import QbittorrentView from './views/QbittorrentView.vue';
import RssfeedView from './views/RssfeedView.vue';
import StartView from './views/StartView.vue';
import VersionsView from './views/VersionsView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView
    },
    {
      path: '/qbittorrent',
      name: 'qbittorrent',
      component: QbittorrentView
    },
    {
      path: '/rssfeed',
      name: 'rssfeed',
      component: RssfeedView
    },
    {
      path: '/kodi',
      name: 'kodi',
      component: KodiView
    },
    {
      path: '/logger',
      name: 'logger',
      component: LoggerView
    },
    {
      path: '/versions',
      name: 'versions',
      component: VersionsView
    }
  ]
});
