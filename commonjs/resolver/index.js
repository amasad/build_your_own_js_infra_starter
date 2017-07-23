const path = require('path');
const fs = require('fs');

function resolve(from, to) {
  if (to[0] === '/') {
    // Absolute require, easy:
    return fullPath(to, true);
  }

  const dir = path.dirname(from);
  if (to[0] === '.') {
    // Relative
    // dir: /project
    // to: ./foo/bar
    // result: /project/foo/bar

    // dir: /project
    // to: ../foo
    // result: /foo
    return fullPath(path.join(dir, to), true);
  }

  // Go through the node resolution algorithm
  // require('lodash');
  // /project/node_modules/lodash
  // /node_modules/lodash
  // / throw
  const packagePath = path.join(dir, 'node_modules', to);
  if (!fs.existsSync(packagePath)) {
    if (dir === '/') throw new Error('No package found: ' + to);
    return resolve(dir, to);
  }

  const packageJson = path.join(packagePath, 'package.json');
  let index = 'index.js';
  if (fs.existsSync(packageJson)) {
    const json = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    if (json.browser) {
      index = json.browser;
    } else if (json.main) {
      index = json.main;
    }
  }

  const resolved = fullPath(path.join(packagePath, index), false);
  if (!resolved) {
    throw new Error('Error finding package main: ' + packagePath);
  }

  return resolved;
}

// require('./foo')
// ./foo
// ./foo.js
// ./foo.json
// throw
function fullPath(modulePath, throws) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }

  if (fs.existsSync(modulePath + '.js')) {
    return modulePath + '.js';
  }

  if (fs.existsSync(module + '.json')) {
    return modulePath + '.json';
  }

  if (throws) throw new Error('Module not found: ' + modulePath);

  return null;
}

module.exports = resolve;
