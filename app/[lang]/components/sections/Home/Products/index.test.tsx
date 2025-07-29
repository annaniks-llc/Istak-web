import React from 'react';
import { render, screen } from '@testing-library/react';
import Products from './index';

// Mock the ProductCard component
jest.mock('../../../ProductCard', () => {
  return function MockProductCard({ title, prise, volume, src }: any) {
    return (
      <div data-testid="product-card">
        <span data-testid="product-title">{title}</span>
        <span data-testid="product-price">{prise}</span>
        <span data-testid="product-volume">{volume}</span>
        <img data-testid="product-image" src={src} alt={title} />
      </div>
    );
  };
});

describe('Products', () => {
  it('renders products section with multiple product cards', () => {
    render(<Products />);
    
    // Check if multiple product cards are rendered (should be 3 based on the component)
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(3);
  });

  it('renders product cards with correct data', () => {
    render(<Products />);
    
    // Check if all product titles are rendered
    const titles = screen.getAllByTestId('product-title');
    expect(titles).toHaveLength(3);
    titles.forEach(title => {
      expect(title).toHaveTextContent('Wheat Malt');
    });
    
    // Check if all product prices are rendered
    const prices = screen.getAllByTestId('product-price');
    expect(prices).toHaveLength(3);
    prices.forEach(price => {
      expect(price).toHaveTextContent('300');
    });
    
    // Check if all product volumes are rendered
    const volumes = screen.getAllByTestId('product-volume');
    expect(volumes).toHaveLength(3);
    volumes.forEach(volume => {
      expect(volume).toHaveTextContent('0.3');
    });
    
    // Check if all product images are rendered
    const images = screen.getAllByTestId('product-image');
    expect(images).toHaveLength(3);
    images.forEach(image => {
      expect(image).toHaveAttribute('src', '/img/png/drink.png');
      expect(image).toHaveAttribute('alt', 'Wheat Malt');
    });
  });

  it('renders with correct container class', () => {
    const { container } = render(<Products />);
    
    // Check if the main container has the correct class
    const productsContainer = container.firstChild;
    expect(productsContainer).toHaveClass('container');
  });
}); 