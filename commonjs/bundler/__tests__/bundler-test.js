jest.mock('fs');

const bundler = require('../');

describe('bundler', () => {
  it('module.exports', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'expect(require("./add")(18, 5)).toBe(23)',
      '/project/add.js': 'module.exports = (a, b) => a + b;',
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);
  });

  it('exports', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'expect(require("./add").add(18, 5)).toBe(23)',
      '/project/add.js': 'exports.add = (a, b) => a + b;',
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);
  });

  it('multiple requires', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'expect(require("./math").sub(18, 5)).toBe(13)',
      '/project/math.js': 'exports.sub = require("sub")',
      '/project/node_modules/sub/index.js': 'module.exports = (a, b) => a - b;',
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);
  });
});
