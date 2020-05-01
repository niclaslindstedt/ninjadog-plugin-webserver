const fs = require('fs-extra');
const path = require('path');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function getPackage(name, isPlugin = true) {
  const fpath = isPlugin
    ? path.resolve(__dirname, '..', `ninjakatt-plugin-${name}`, 'package.json')
    : path.resolve(__dirname, '..', name, 'package.json');
  return await fs.readJSON(fpath);
}

module.exports = {
  asyncForEach,
  getPackage,
};
