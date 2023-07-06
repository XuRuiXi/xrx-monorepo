import React from 'react';
import { render, screen } from '@testing-library/react';
import Tabs from '../src/Tabs';

// @testing-library/jest-dom/extend-expect 这个包提供了一些额外的断言方法，可以让我们的测试用例写起来更加方便
// 例如，我们可以使用 toBeInTheDocument 来判断一个元素是否在文档中
import '@testing-library/jest-dom/extend-expect';

describe('React', () => {
  test('renders App component', () => {
    render(<Tabs/>);
    // screen.debug(); // 显示渲染后的 DOM
    const dom = screen.getByText(/目前显示的tabkey是：/);
    // 表示dom元素在文档中
    expect(dom).toBeInTheDocument();
  });
});