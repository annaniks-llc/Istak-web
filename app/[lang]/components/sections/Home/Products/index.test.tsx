import React from 'react';
import { render, screen } from '@testing-library/react';
import Products from './index';

// Mock dictionary
jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    products: {
      title: 'Our Products',
      subtitle: 'Discover our premium selection',
      search: {
        placeholder: 'Search products...',
        noResults: 'No products found',
      },
      filters: {
        category: 'Category',
        sortOptions: {
          name: 'Name',
          price: 'Price',
          rating: 'Rating',
        },
        clear: 'Clear Filters',
      },
      product: {
        addToCart: 'Add to Cart',
        outOfStock: 'Out of Stock',
      },
    },
  }),
}));

// Mock the ProductCard component
jest.mock('../../../ProductCard', () => {
  return function MockProductCard({ src, title, prise, volume }: { src: string; title: string; prise: number; volume: number }) {
    return (
      <div data-testid="product-card">
        <img src={src} alt={title} />
        <h3>{title}</h3>
        <p>
          {prise} դր {volume} լ
        </p>
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
    titles.forEach((title) => {
      expect(title).toHaveTextContent('Wheat Malt');
    });

    // Check if all product prices are rendered
    const prices = screen.getAllByTestId('product-price');
    expect(prices).toHaveLength(3);
    prices.forEach((price) => {
      expect(price).toHaveTextContent('300');
    });

    // Check if all product volumes are rendered
    const volumes = screen.getAllByTestId('product-volume');
    expect(volumes).toHaveLength(3);
    volumes.forEach((volume) => {
      expect(volume).toHaveTextContent('0.3');
    });

    // Check if all product images are rendered
    const images = screen.getAllByTestId('product-image');
    expect(images).toHaveLength(3);
    images.forEach((image) => {
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
