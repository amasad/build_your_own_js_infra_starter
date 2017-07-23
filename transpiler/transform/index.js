const babylon = require('babylon');
const t = require('babel-types');
const generate = require('babel-generator').default;

function walk(node, visitors) {
  if (!isNode(node)) return node;

  let modified = visitors[node.type] ? visitors[node.type](node) : node;

  for (const key in modified) {
    if (Array.isArray(modified[key])) {
      modified[key] = modified[key].map(child => {
        return walk(child, visitors);
      });
    } else if (isNode(modified[key])) {
      modified[key] = walk(modified[key], visitors);
    }
  }

  return modified;
}

function transform(code, visitors) {
  const ast = babylon.parse(code);

  walk(ast.program, visitors);

  return generate(ast).code;
}

function isNode(node) {
  return node && node.type != null;
}

module.exports = transform;
