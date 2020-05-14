const fs = require('fs-extra');
const path = require('path');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getPackage(name, isPlugin = true) {
  if (isPlugin) {
    var pluginPath = path.resolve(
      __dirname,
      '..',
      `ninjadog-plugin-${name}`,
      'package.json'
    );
    if (!fs.existsSync(firstPath)) {
      pluginPath = path.resolve(__dirname, '../plugins', name, 'package.json');
    }
    return await fs.readJSON(pluginPath);
  }

  var fpath = path.resolve(__dirname, '..', name, 'package.json');
  return await fs.readJSON(fpath);
}

module.exports = {
  asyncForEach,
  getPackage,
};
