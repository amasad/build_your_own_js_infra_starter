const transform = require('../');
const t = require('babel-types');

describe('transform', () => {
  it('should transform a literal', () => {
    const code = transform('1;', {
      NumericLiteral(node) {
        return t.numericLiteral(2);
      },
    });

    expect(code).toBe('2;');
  });

  it('should keep the same node', () => {
    const code = transform('1;', {
      NumericLiteral(node) {
        return node;
      },
    });

    expect(code).toBe('1;');
  });

  it('should delete a node', () => {
    const code = transform('x = 1;console.log(a)', {
      ExpressionStatement(node) {
        if (t.isCallExpression(node.expression)) {
          return null;
        }

        return node;
      },
    });

    expect(code).toBe('x = 1;');
  });
});
