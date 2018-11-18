import StartView from './views/StartView.js';
import QbittorrentView from './views/QbittorrentView.js';
import TorrentrssView from './views/TorrentrssView.js';
import KodiView from './views/KodiView.js';
import LoggerView from './views/LoggerView.js';

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
    path: '/torrentrss',
    name: 'torrentrss',
    component: TorrentrssView
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
