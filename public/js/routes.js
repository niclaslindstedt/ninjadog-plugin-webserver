import KodiView from './views/KodiView.js';
import LoggerView from './views/LoggerView.js';
import QbittorrentView from './views/QbittorrentView.js';
import RssfeedView from './views/RssfeedView.js';
import StartView from './views/StartView.js';

export default [
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
  }
];
