import axios from 'axios';

export default class Api {
  constructor() {
    this._plugins = [];
    this._routes = [];
    this._info = {};

    this.init();
  }

  get plugins() {
    return this._plugins;
  }

  get routes() {
    return this._routes;
  }

  get info() {
    return this._info;
  }

  async init() {
    let api = await axios.get('/api').then(res => res.data);
    this._plugins = api.plugins;
    this._routes = api.routes;
    this._info = api.info;
  }
}
