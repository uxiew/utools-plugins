/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
const { join, sep } = require('path');

class AsarHeader {
  constructor(node) {
    if (node && Object.prototype.toString.call(node.files) === '[object Object]') {
      this.files = JSON.parse(JSON.stringify(node.files));
    }
    this.files = {};
  }

  insertNode(path, node) {
    if (!path) return false;
    let p = join(path);

    if (p[0] === '/' || p[0] === '\\') p = p.substring(1);
    if (p === '' || p === '.') return false;

    const paths = p.split(sep);
    let pointer = this.files;

    for (let i = 0; i < paths.length - 1; i++) {
      if (pointer[paths[i]] !== undefined) {
        pointer = pointer[paths[i]].files;
      } else {
        pointer[paths[i]] = { files: {} };
        pointer = pointer[paths[i]].files;
      }
    }

    pointer[paths[paths.length - 1]] = node;
    return true;
  }

  removeNode(path) {
    if (!path) return false;
    let p = join(path);

    if (p[0] === '/' || p[0] === '\\') p = p.substring(1);
    if (p === '' || p === '.') {
      this.files = {};
      return true;
    }

    const paths = p.split(sep);
    let pointer = this.files;

    for (let i = 0; i < paths.length - 1; i++) {
      if (pointer === undefined) return true;
      if (pointer[paths[i]] !== undefined) {
        pointer = pointer[paths[i]].files;
      }
    }

    if (!pointer || pointer[paths[paths.length - 1]] === undefined) return true;
    delete pointer[paths[paths.length - 1]];
    return true;
  }

  getNode(path) {
    if (!path) return null;
    let p = join(path);

    if (p[0] === '/' || p[0] === '\\') p = p.substring(1);
    if (p === '' || p === '.') return this;

    const paths = p.split(sep);
    let pointer = this.files;

    for (let i = 0; i < paths.length - 1; i++) {
      if (pointer === undefined) return null;
      if (pointer[paths[i]] !== undefined) {
        pointer = pointer[paths[i]].files;
      }
    }

    if (!pointer || pointer[paths[paths.length - 1]] === undefined) return null;
    return pointer[paths[paths.length - 1]];
  }
}

module.exports = AsarHeader;
