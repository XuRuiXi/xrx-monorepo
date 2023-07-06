import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FetchCop from '../components/FetchCop';

describe('FetchCop', () => {
  test('should render fetched data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => 'xrx'
    });
    render(<FetchCop />);
    const nameItems = await screen.findByText(/姓名：xrx/);
    expect(nameItems).toBeInTheDocument();
    delete global.fetch;
  });
});