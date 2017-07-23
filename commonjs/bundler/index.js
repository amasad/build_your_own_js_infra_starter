const resolver = require('../resolver');
const path = require('path');
const fs = require('fs');

const requireRe = /\brequire\s*?\(\s*?(['"])([^"']+)\1\s*?\)/g;
function extractRequires(filePath, code) {
  const requires = [];
  requireRe.lastIndex = 0;
  let m;
  do {
    m = requireRe.exec(code);
    if (m && m[2]) {
      requires.push(m[2]);
    }
  } while (m);

  return requires.map(name => ({
    name,
    path: resolver(filePath, name),
  }));
}

function define(id, moduleMap, factory) {
  if (!define.map) define.map = {};
  if (define.map[id]) throw new Error(`Module with id ${id} already defined`);

  function require(name) {
    const id = moduleMap[name];
    if (typeof id !== 'number') {
      throw new Error(`Module '${name}' did not resolve`);
    }

    const module = define.map[id];
    if (!module) {
      throw new Error(`Module '${name}' was not found`);
    }

    return module.exports;
  }

  const exports = {};
  const module = {
    exports,
  };

  define.map[id] = module;
  factory(require, module, exports);
}

function bundle(entry) {
  const modules = [];
  const visited = Object.create(null);
  const pathToId = Object.create(null);
  let id = 0;

  visit(path.resolve(entry));

  function visit(path) {
    if (visited[path]) return;

    visited[path] = true;
    pathToId[path] = ++id;

    const code = fs.readFileSync(path, 'utf8');
    const requires = extractRequires(path, code);

    for (const requirePath of requires.map(r => r.path)) {
      visit(requirePath);
    }

    modules.push({
      path,
      requires,
      code,
    });
  }

  let source = define.toString() + '\n';
  for (const module of modules) {
    const moduleMap = {};
    module.requires.forEach(
      ({ name, path }) => (moduleMap[name] = pathToId[path]),
    );

    source += `
define(
  ${pathToId[module.path]},
  ${JSON.stringify(moduleMap)},
  function(require, module, exports) {
    ${module.code}
  }
);
    `;
  }

  return source;
}

module.exports = { bundle };
