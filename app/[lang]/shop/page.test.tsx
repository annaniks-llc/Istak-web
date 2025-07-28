import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ShopPage from './page';

jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    shop: { heading: 'Shop' },
  }),
}));

describe('ShopPage', () => {
  it('renders shop heading and products', () => {
    render(<ShopPage />);
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });
}); 