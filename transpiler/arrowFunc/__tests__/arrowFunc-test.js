const arrowFunc = require('../');
const t = require('babel-types');

describe('transform', () => {
  it('should transform an arrow func expression', () => {
    const code = 'var add = (a, b) => a + b';
    const func = arrowFunc(code);
    expect(func).toMatch(/function/);

    eval(func);
    expect(add(1, 4)).toBe(5);
  });

  it('should transform an arrow func with body', () => {
    const code = 'var add = (a, b) => { return a + b; }';
    const func = arrowFunc(code);
    expect(func).toMatch(/function/);

    eval(func);
    expect(add(1, 4)).toBe(5);
  });
});
