import React from 'react';
import { screen, render } from "@testing-library/react";
// 导入拓展的断言库
import '@testing-library/jest-dom/extend-expect';

import PromiseAsyncCop from '../components/PromiseAsyncCop';

describe('PromiseAsyncCop', () => {
  test('PromiseAsyncCop', async () => {
    render(<PromiseAsyncCop />);
    const text = await screen.findByText(/姓名：xrx/);
    expect(text).toBeInTheDocument();
  });
});