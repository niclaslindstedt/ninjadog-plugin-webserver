import axios from 'axios';

export default class Api {
  constructor() {
    this._plugins = [];
    this._routes = [];

    this.init();
  }

  get plugins() {
    return this._plugins;
  }

  get routes() {
    return this._routes;
  }

  async init() {
    let api = await axios.get('/api').then(res => res.data);
    this._plugins = api.plugins;
    this._routes = api.routes;
  }
}
