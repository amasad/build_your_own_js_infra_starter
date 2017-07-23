jest.mock('fs');

const bundler = require('../');

describe('bundler', () => {
  it('module.exports', () => {
    let called = 0;
    require('fs').__setMockFiles({
      '/project/index.js': `
        called++;
        const add = require("./add");
        expect(add(18, 5)).toBe(23);
      `,
      '/project/add.js': `
        called++;
       module.exports = (a, b) => a + b;
      `,
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);

    expect(called).toBe(2);
  });

  it('exports', () => {
    let called = 0;

    require('fs').__setMockFiles({
      '/project/index.js': `
        called++;
        const add = require("./add");
        expect(add.add(18, 5)).toBe(23)
      `,
      '/project/add.js': `
        called++;
        exports.add = (a, b) => a + b;
       `,
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);

    expect(called).toBe(2);
  });

  it('multiple requires', () => {
    let called = 0;
    require('fs').__setMockFiles({
      '/project/index.js': `
        called++;
        const math = require("./math");
        expect(math.sub(18, 5)).toBe(13)
       `,
      '/project/math.js': `
        called++;
        exports.sub = require("sub")
      `,
      '/project/node_modules/sub/index.js': `
        called++;
        module.exports = (a, b) => a - b;
      `,
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);

    expect(called).toBe(3);
  });

  it('calls module factory once', () => {
    let called = 0;
    require('fs').__setMockFiles({
      '/project/index.js': `
        called++;
        require('./foo');
        require('./foo');
      `,
      '/project/foo.js': `
        called++;
      `,
    });

    const source = bundler.bundle('/project/index.js');
    eval(source);

    expect(called).toBe(2);
  });
});
