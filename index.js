const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const cors = require('cors');
const { asyncForEach, getPackage } = require('./helpers');

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
    this.logDebug('Setting up webserver plugin');
    setTimeout(() => {
      const built = fs.existsSync(path.resolve(__dirname, 'dist'));
      if (!built) {
        this.logInfo('Building page...');
        const building = exec('npm run build', { cwd: __dirname });
        building.on('exit', () => {
          this.startServer();
        });
      } else {
        this.startServer();
      }
    }, 2000);
  }

  subscriptions() {
    this.subscribe('webserver.add-route', this.actOnAddedRoute);
  }

  /********* Event Functions *********/

  actOnAddedRoute = (method, route, callback) => {
    app[method](route, callback);
    this.logInfo(`Added route ${method}: ${route}`);
  };

  /********* Plugin Functions *********/

  startServer() {
    this.logInfo('Starting');

    if (this.server) {
      this.server.close();
    }

    const apiPrefix = '/api';

    app.get(`${apiPrefix}`, async (req, res) => {
      const plugins = await this.getPlugins();
      const mainPackage = await getPackage('ninjadog', false);
      res.status(200).send({
        plugins,
        info: {
          version: mainPackage.version,
        },
        routes: app._router.stack
          .filter((r) => r.name === 'bound dispatch')
          .map((r) => ({
            route: r.route.path,
            method: Object.keys(r.route.methods)[0],
          }))
          .reverse(),
      });
    });

    this.server = http.createServer(app);
    this.server.listen(this.settings.port, () => {
      this.logInfo(`Started, listening on port ${this.settings.port}`);
    });
  }

  async getPlugins() {
    const plugins = global.Ninjadog.plugins.installed.map((p) => ({
      name: p.toLowerCase(),
      version: '',
    }));

    await asyncForEach(plugins, async (plugin) => {
      const pkg = await getPackage(plugin.name);
      plugin.version = pkg.version;
    });

    return plugins;
  }
};
