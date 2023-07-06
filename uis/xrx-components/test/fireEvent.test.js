import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '../components/Tabs';
import Input from '../components/Input';

describe('Event', () => {
  test('on click', () => {
    render(<Tabs />);
    fireEvent.click(screen.getByText('Tab 2'));
    const dom = screen.getByText('Tab 2');
    // 获取dom的aria-selected属性
    expect(dom.getAttribute('aria-selected')).toBe('true');
  });

  test('on change', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    // 获取input元素
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: 'hello' },
    });
    // 判断input元素的值是否为hello
    expect(input.value).toBe('hello');
    // 判断onChange方法是否被调用
    expect(onChange).toHaveBeenCalled();
    // 判断调用了几次
    expect(onChange).toHaveBeenCalledTimes(1);
  });

});
