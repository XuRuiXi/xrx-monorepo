function timeout(cb) {
  setTimeout(() => {
    cb(1);
  }, 1000);
}

describe('执行时机', () => {
  test('timeout', done => {
    function cb(date) {
      expect(date).toBe(1);
      done();
    }
    timeout(cb);
  });
});