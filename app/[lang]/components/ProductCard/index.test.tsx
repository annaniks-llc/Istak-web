import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from './index';

describe('ProductCard', () => {
  const mockProps = {
    src: '/test-image.jpg',
    title: 'Test Product',
    prise: 500,
    volume: 0.5,
    showAddToCartButton: true,
  };

  it('renders product card with correct props', () => {
    render(<ProductCard {...mockProps} />);

    // Check if title is rendered
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if price and volume are rendered
    expect(screen.getByText('500 դր 0.5 լ')).toBeInTheDocument();

    // Check if image is rendered with correct src
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders with different props', () => {
    const differentProps = {
      src: '/another-image.jpg',
      title: 'Another Product',
      prise: 750,
      volume: 1.0,
      showAddToCartButton: true,
    };

    render(<ProductCard {...differentProps} />);

    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('750 դր 1 լ')).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/another-image.jpg');
  });

  it('renders with zero price and volume', () => {
    const zeroProps = {
      src: '/zero-image.jpg',
      title: 'Free Product',
      prise: 0,
      volume: 0,
      showAddToCartButton: true,
    };

    render(<ProductCard {...zeroProps} />);

    expect(screen.getByText('Free Product')).toBeInTheDocument();
    expect(screen.getByText('0 դր 0 լ')).toBeInTheDocument();
  });
});
