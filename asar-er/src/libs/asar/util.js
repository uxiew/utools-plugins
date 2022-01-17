/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */

const { readdirSync } = process.versions.electron ? require('original-fs') : require('fs-extra');
const { join } = require('path');

function walkDir(dir, callback) {
  const items = readdirSync(dir);
  for (let i = 0; i < items.length; i++) {
    if (items[i] !== '.' && items[i] !== '..') {
      const full = join(dir, items[i]);
      callback(full);
    }
  }
}

module.exports = {
  walkDir,
};
