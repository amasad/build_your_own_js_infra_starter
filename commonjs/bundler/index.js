const resolver = require('../resolver');
const fs = require('fs');

const requireRe = /\brequire\s*?\(\s*?(['"])([^"']+)\1\s*?\)/g;

function wrap(source) {
  return [
    '(function(module) {',
    'module.exports = {};',
    'let exports = module.exports;',
    source,
    'return module.exports;',
    '})({})'
  ].join('\n');
}

function bundle(entry) {
  const source = fs.readFileSync(entry);

  if (!source.match(requireRe)) {
    return source;
  }

  const replaces = source.replace(requireRe, (match) => {
    const matchPath = match.replace('require(', '').replace(')', '').replace(/"/g, '');
    const resolvedMatch = resolver(entry, matchPath);
    const inlinedSource = bundle(resolvedMatch);
    const wrappedSource = wrap(inlinedSource);

    return wrappedSource;
  });

  return replaces;
}

module.exports = { bundle };
