
// expect.assertions(2) 用于确保一定数量的断言被调用。否则一个fulfilled态的Promise不会让测试用例失败。
// 函数必须返回promise或者使用async/await来测试异步代码
describe('执行时机', () => {
  test('timeouts', async () => {
    expect.assertions(2);
    await expect(Promise.resolve(1)).resolves.toBe(1);
    await expect(Promise.reject(1)).rejects.toBe(1);
  });
});