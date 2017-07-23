const transform = require('../transform');
const t = require('babel-types');

module.exports = code => {
  return transform(code, {
    ArrowFunctionExpression(node) {
      let newBody = node.body;
      if (newBody && newBody.type !== "BlockStatement") {
        newBody = t.blockStatement(
          [t.returnStatement(newBody)]
        );
      }
      return t.functionExpression(node.id, node.params, newBody);
    },
  });
};
