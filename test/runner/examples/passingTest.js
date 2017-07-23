const assert = require('assert');

class Math {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  add() {
    return this.a + this.b;
  }

  sub() {
    return this.a - this.b;
  }
}

describe('Math', () => {
  let math;
  before(() => {
    math = new Math(3, 5);
  });

  it('should create math', () => {
    assert.equal(math.a, 3);
    assert.equal(math.b, 5);
  });

  describe('add', () => {
    it('should add', () => {
      assert.equal(math.add(), 8);
    });
  });

  describe('sub', () => {
    it('should sub', () => {
      assert.equal(math.sub(), -2);
    });
  });
});
