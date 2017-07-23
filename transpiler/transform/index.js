const babylon = require('babylon');
const t = require('babel-types');
const generate = require('babel-generator').default;

function transform(code, visitors) {
  const ast = babylon.parse(code);

  // visitors: {
  //   NumericLiteral: function() {}
  // }

  // go through ast and
  // for every node
  // check its type matches a visitor
  // call the handler for the visitor

  return generate(ast).code;
}

function isNode(node) {
  return node && typeof node === 'object' && t.TYPES.includes(node.type);
}

mmodule.exports = transform;
