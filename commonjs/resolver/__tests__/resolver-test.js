jest.mock('fs');

const resolve = require('../');

describe('resolve', () => {
  it('should resolve relative', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'require("./util")',
      '/project/util.js': 'module.exports = {};',
    });

    expect(resolve('/project/index.js', './util')).toBe('/project/util.js');
  });

  it('should resolve absolute', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'require("/project/util")',
      '/project/util.js': 'module.exports = {};',
    });

    expect(resolve('/project/index.js', '/project/util')).toBe(
      '/project/util.js',
    );
  });

  it('should throw when file not found', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'require("./util")',
    });

    expect(() => resolve('/project/index.js', './util')).toThrow();
  });

  it('should resolve absolute', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'require("/project/util")',
      '/project/util.js': 'module.exports = {};',
    });

    expect(resolve('/project/index.js', '/project/util')).toBe(
      '/project/util.js',
    );
  });

  it('should resolve node_modules', () => {
    require('fs').__setMockFiles({
      '/project/index.js': 'require("util")',
      '/project/node_modules/util/index.js': 'module.exports = {};',
    });

    expect(resolve('/project/index.js', 'util')).toBe(
      '/project/node_modules/util/index.js',
    );
  });
});
