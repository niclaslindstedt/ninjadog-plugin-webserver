const Base = require('ninjakatt-plugin-base');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const emitter = global.emitter;
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname + '/public'));
app.locals.test = 'ass';

module.exports = class Webserver extends Base {
  constructor() {
    super(__dirname);
    this.server = null;
    this.router = null;
  }

  setup() {
    this.setupListeners();
    setTimeout(() => this.startServer(), 2000);
  }

  startServer() {
    if (this.server) {
      this.server.close();
    }

    const apiPrefix = '/api';

    app.get(`${apiPrefix}`, function(req, res) {
      res.status(200).send({
        plugins: global.Ninjakatt.plugins.installed.map(p => p.toLowerCase()),
        routes: app._router.stack
          .filter(r => r.name === 'bound dispatch')
          .map(r => ({
            route: r.route.path,
            method: Object.keys(r.route.methods)[0]
          }))
          .reverse()
      });
    });

    this.server = http.createServer(app);
    this.server.listen(this.settings.port);
  }

  addRoute(method, route, callback) {
    app[method](route, callback);
    emitter.emit('message', `Added route ${method}: ${route}`, 'info');
  }

  setupListeners() {
    emitter.register(
      'webserver.add-route',
      this.addRoute.bind(this),
      Webserver.name
    );
  }
};
