function promiseFn() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('success');
    }, 1000);
  });
}

describe('执行时机', () => {
  test('promise', async () => {
    expect.assertions(1);
    const data = await promiseFn();
    expect(data).toBe('success');
  });
});

// 也可以返回一个promise，这样jest会等待promise resolve之后再结束测试
// test('promise', () => {
//   return promiseFn().then(data => {
//     expect(data).toBe('success');
//   });
// });
