const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const cors = require('cors');
const emitter = global.emitter;

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname + '/dist'));
app.use(cors());

module.exports = class Webserver {
  constructor() {
    this.construct(__dirname);
    this.server = null;
    this.router = null;
  }
  setup() {
    this.setupListeners();
    setTimeout(() => {
      const built = fs.existsSync(path.resolve(__dirname, 'dist'));
      if (!built) {
        emitter.emit('message', `Building page...`, 'info', Webserver.name);

        const building = exec('npm run build', { cwd: __dirname });
        building.on('exit', () => {
          this.startServer();
        });
      } else {
        this.startServer();
      }
    }, 2000);
  }

  startServer() {
    emitter.emit('message', `Starting`, 'info', Webserver.name);

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
            method: Object.keys(r.route.methods)[0],
          }))
          .reverse(),
      });
    });

    this.server = http.createServer(app);
    this.server.listen(this.settings.port, () => {
      emitter.emit(
        'message',
        `Started, listening on port ${this.settings.port}`,
        'info',
        Webserver.name
      );
    });
  }

  addRoute(method, route, callback) {
    app[method](route, callback);
    emitter.emit(
      'message',
      `Added route ${method}: ${route}`,
      'info',
      Webserver.name
    );
  }

  setupListeners() {
    emitter.register(
      'webserver.add-route',
      this.addRoute.bind(this),
      Webserver.name
    );
  }
};
