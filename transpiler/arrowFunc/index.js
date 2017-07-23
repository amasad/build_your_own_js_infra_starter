const transform = require('../transform');
const t = require('babel-types');

module.exports = code => {
  return transform(code, {
    ArrowFunctionExpression(node) {},
  });
};
