import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Login/i);
  expect(headerElement).toBeInTheDocument();
});
