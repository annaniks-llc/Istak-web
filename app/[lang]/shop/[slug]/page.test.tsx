import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProductPage from './page';

jest.mock('@/dictionary-provider', () => ({
  useDictionary: () => ({
    shop: { productTitle: 'Product', productDescription: 'Description' },
  }),
}));
jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'test-product' }),
}));

describe('ProductPage', () => {
  it('renders product title and description', () => {
    render(<ProductPage />);
    expect(screen.getByText('Product: test-product')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
}); 