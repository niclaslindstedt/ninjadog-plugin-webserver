const fs = require('fs-extra');
const path = require('path');

async function asyncForEach(array, callback) {
  let jobs = [];
  for (let index = 0; index < array.length; index++) {
    jobs.push(callback(array[index], index, array));
  }
  return await Promise.all(jobs);
}

async function getPackage(name, isPlugin = true) {
  if (isPlugin) {
    var pluginPath = path.resolve(__dirname, '..', `ninjadog-plugin-${name}`, 'package.json');
    if (!fs.existsSync(pluginPath)) {
      pluginPath = path.resolve(__dirname, '..', name, 'package.json');
    }
    return await fs.readJSON(pluginPath);
  }

  var fpath = path.resolve(__dirname, '../..', name, 'package.json');
  if (!fs.existsSync(fpath)) {
    fpath = path.resolve(__dirname, '../../base', 'package.json');
  }
  return await fs.readJSON(fpath);
}

module.exports = {
  asyncForEach,
  getPackage,
};
