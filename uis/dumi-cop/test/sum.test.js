import { sum } from '../utils';

describe('test something', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  test('toBe & toEqual', () => {
    const a = { one: 1, two: 2 };
    expect(a).toBe(a);
    expect(a).toEqual({ two: 2, one: 1 });
  });
});
