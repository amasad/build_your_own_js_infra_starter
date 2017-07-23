const Test = require('../');

describe('test', () => {
  it('should create a test and suite objects', () => {
    const t = new Test();

    const fooBefore = jest.fn();
    const fooAfter = jest.fn();
    const fooTest1 = jest.fn();
    const fooTest2 = jest.fn();

    const fooBarBefore = jest.fn();
    const fooBarTest = jest.fn();

    const wooBefore = jest.fn();
    const wooTest = jest.fn();

    t.describe('foo', () => {
      t.before(fooBefore);
      t.after(fooAfter);

      t.it('foo test 1', fooTest1);
      t.it('foo test 2', fooTest2);

      t.describe('bar', () => {
        t.before(fooBarBefore);

        t.it('foo bar test', fooBarTest);
      });
    });

    t.describe('woo', () => {
      t.before(wooBefore);

      t.it('woo test', wooTest);
    });

    expect(t.suites[0].name).toBe('foo');
    expect(t.suites[0].after).toBe(fooAfter);
    expect(t.suites[0].tests[0].func).toBe(fooTest1);
    expect(t.suites[0].tests[0].name).toBe('foo test 1');
    expect(t.suites[0].tests[1].func).toBe(fooTest2);
    expect(t.suites[0].tests[1].name).toBe('foo test 2');

    expect(t.suites[0].suites[0].name).toBe('bar');
    expect(t.suites[0].suites[0].before).toBe(fooBarBefore);
    expect(t.suites[0].suites[0].tests[0].func).toBe(fooBarTest);

    expect(t.suites[1].name).toBe('woo');
    expect(t.suites[1].before).toBe(wooBefore);
    expect(t.suites[1].tests[0].func).toBe(wooTest);
    expect(t.suites[1].tests[0].name).toBe('woo test');

    t.suites[0].run();
    expect(t.suites[0].before.mock.calls.length).toBe(2);
    expect(t.suites[0].after.mock.calls.length).toBe(2);
    expect(t.suites[0].tests[0].func.mock.calls.length).toBe(1);
    expect(t.suites[0].tests[1].func.mock.calls.length).toBe(1);
  });
});
