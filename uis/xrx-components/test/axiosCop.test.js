import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AxiosCop from '../components/AxiosCop';
 
jest.mock('axios');
 
describe('App', () => {
  test('fetches name from an API and displays them', async () => {
    axios.get.mockImplementationOnce(() =>  Promise.resolve('29'));
    render(<AxiosCop />);
    const ageItems = await screen.findByText(/年龄：29/);
    expect(ageItems).toBeInTheDocument();
    axios.get.mockImplementationOnce(() =>  Promise.resolve('xrx'));
    fireEvent.click(screen.getByRole('button'));
    const nameItems = await screen.findByText(/姓名：xrx/);
    expect(nameItems).toBeInTheDocument();
  });
});