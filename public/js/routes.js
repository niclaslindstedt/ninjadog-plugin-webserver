import LoggerView from './views/LoggerView.js';
import QbView from './views/QbView.js';
import RssReaderView from './views/RssReaderView.js';
import StartView from './views/StartView.js';

export default [
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
    path: '/rssreader',
    name: 'rssreader',
    component: RssReaderView,
  },
  {
    path: '/logger',
    name: 'logger',
    component: LoggerView,
  },
];
