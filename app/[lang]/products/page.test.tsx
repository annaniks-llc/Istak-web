import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsPage from './page';
import { useProductsStore } from '@/app/zustand/store/products';
import { useCartStore } from '@/app/zustand/store/cart';
import { useDictionary } from '@/dictionary-provider';
import toast from 'react-hot-toast';

// Mock Zustand stores
jest.mock('@/app/zustand/store/products', () => ({
  useProductsStore: jest.fn(),
}));

jest.mock('@/app/zustand/store/cart', () => ({
  useCartStore: jest.fn(),
}));

// Mock dictionary provider
jest.mock('@/dictionary-provider', () => ({
  useDictionary: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockDictionary = {
  products: {
    title: 'Our Products',
    subtitle: 'Discover our premium selection of alcoholic beverages',
    search: {
      placeholder: 'Search products...',
      noResults: 'No products found',
    },
    filters: {
      category: 'Category',
      sortBy: 'Sort By',
      sortOptions: {
        name: 'Name',
        price: 'Price',
        rating: 'Rating',
      },
      clear: 'Clear Filters',
    },
    categories: {
      all: 'All Categories',
      vodka: 'Vodka',
      whiskey: 'Whiskey',
      rum: 'Rum',
      gin: 'Gin',
      tequila: 'Tequila',
      wine: 'Wine',
      beer: 'Beer',
      cocktail: 'Cocktails',
    },
    product: {
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
    },
  },
  common: {
    loading: 'Loading...',
  },
};

const mockProducts = [
  {
    id: '1',
    name: 'Premium Vodka',
    description: 'Smooth and clean premium vodka',
    price: 45.99,
    volume: 750,
    category: 'vodka',
    image: '/img/png/drink.png',
    alcoholContent: 40,
    origin: 'Russia',
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Classic Whiskey',
    description: 'Rich and smooth whiskey',
    price: 65.99,
    volume: 750,
    category: 'whiskey',
    image: '/img/png/drink.png',
    alcoholContent: 45,
    origin: 'Scotland',
    inStock: true,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: 'Out of Stock Gin',
    description: 'Premium gin',
    price: 35.99,
    volume: 750,
    category: 'gin',
    image: '/img/png/drink.png',
    alcoholContent: 43,
    origin: 'England',
    inStock: false,
    rating: 4.2,
    reviews: 67,
  },
];

const mockAddItem = jest.fn();
const mockSearchProducts = jest.fn();

const mockProductsStore = {
  products: mockProducts,
  isLoading: false,
  fetchProducts: jest.fn(),
  searchProducts: mockSearchProducts,
};

const mockCartStore = {
  addItem: mockAddItem,
};

describe('ProductsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDictionary as jest.Mock).mockReturnValue(mockDictionary);
    (useProductsStore as jest.Mock).mockReturnValue(mockProductsStore);
    (useCartStore as jest.Mock).mockReturnValue(mockCartStore);
  });

  it('renders products page with header', () => {
    render(<ProductsPage />);

    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByText('Discover our premium selection of alcoholic beverages')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<ProductsPage />);

    const searchInput = screen.getByPlaceholderText('Search products...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders category filter', () => {
    render(<ProductsPage />);

    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('all')).toBeInTheDocument();
  });

  it('renders sort controls', () => {
    render(<ProductsPage />);

    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
  });

  it('renders all products by default', () => {
    render(<ProductsPage />);

    expect(screen.getByText('Premium Vodka')).toBeInTheDocument();
    expect(screen.getByText('Classic Whiskey')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock Gin')).toBeInTheDocument();
  });

  it('filters products by category', () => {
    render(<ProductsPage />);

    const categorySelect = screen.getByDisplayValue('all');
    fireEvent.change(categorySelect, { target: { value: 'vodka' } });

    expect(screen.getByText('Premium Vodka')).toBeInTheDocument();
    expect(screen.queryByText('Classic Whiskey')).not.toBeInTheDocument();
    expect(screen.queryByText('Out of Stock Gin')).not.toBeInTheDocument();
  });

  it('searches products when search query is entered', () => {
    mockSearchProducts.mockReturnValue([mockProducts[0]]);

    render(<ProductsPage />);

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'vodka' } });

    expect(mockSearchProducts).toHaveBeenCalledWith('vodka');
  });

  it('sorts products by name', () => {
    render(<ProductsPage />);

    const sortSelect = screen.getByDisplayValue('name');
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    // Products should be sorted alphabetically
    const productNames = screen.getAllByText(/Premium Vodka|Classic Whiskey|Out of Stock Gin/);
    expect(productNames[0]).toHaveTextContent('Classic Whiskey');
  });

  it('sorts products by price', () => {
    render(<ProductsPage />);

    const sortSelect = screen.getByDisplayValue('name');
    fireEvent.change(sortSelect, { target: { value: 'price' } });

    // Products should be sorted by price (lowest first)
    const productNames = screen.getAllByText(/Premium Vodka|Classic Whiskey|Out of Stock Gin/);
    expect(productNames[0]).toHaveTextContent('Out of Stock Gin'); // $35.99
  });

  it('sorts products by rating', () => {
    render(<ProductsPage />);

    const sortSelect = screen.getByDisplayValue('name');
    fireEvent.change(sortSelect, { target: { value: 'rating' } });

    // Products should be sorted by rating (highest first)
    const productNames = screen.getAllByText(/Premium Vodka|Classic Whiskey|Out of Stock Gin/);
    expect(productNames[0]).toHaveTextContent('Classic Whiskey'); // 4.8 rating
  });

  it('toggles sort order when sort button is clicked', () => {
    render(<ProductsPage />);

    const sortButton = screen.getByText('↑');
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('adds product to cart when add to cart button is clicked', () => {
    render(<ProductsPage />);

    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);

    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Premium Vodka',
      price: 45.99,
      volume: 750,
      image: '/img/png/drink.png',
    });
    expect(toast.success).toHaveBeenCalledWith('Premium Vodka added to cart!');
  });

  it('shows out of stock message for unavailable products', () => {
    render(<ProductsPage />);

    const outOfStockButtons = screen.getAllByText('Out of Stock');
    expect(outOfStockButtons).toHaveLength(1);

    const outOfStockButton = outOfStockButtons[0];
    expect(outOfStockButton).toBeDisabled();
  });

  it('shows loading state when products are loading', () => {
    const loadingStore = {
      ...mockProductsStore,
      isLoading: true,
    };

    (useProductsStore as jest.Mock).mockReturnValue(loadingStore);

    render(<ProductsPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows no results message when no products match filters', () => {
    const emptyStore = {
      ...mockProductsStore,
      products: [],
    };

    (useProductsStore as jest.Mock).mockReturnValue(emptyStore);

    render(<ProductsPage />);

    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('clears filters when clear filters button is clicked', () => {
    render(<ProductsPage />);

    // Set some filters first
    const categorySelect = screen.getByDisplayValue('all');
    const searchInput = screen.getByPlaceholderText('Search products...');

    fireEvent.change(categorySelect, { target: { value: 'vodka' } });
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Click clear filters
    const clearFiltersButton = screen.getByText('Clear Filters');
    fireEvent.click(clearFiltersButton);

    // Filters should be reset
    expect(screen.getByDisplayValue('all')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });

  it('displays product details correctly', () => {
    render(<ProductsPage />);

    // Check product information is displayed
    expect(screen.getByText('Premium Vodka')).toBeInTheDocument();
    expect(screen.getByText('Smooth and clean premium vodka')).toBeInTheDocument();
    expect(screen.getByText('$45.99')).toBeInTheDocument();
    expect(screen.getByText('750ml')).toBeInTheDocument();
    expect(screen.getByText('40% ABV')).toBeInTheDocument();
    expect(screen.getByText('Origin: Russia')).toBeInTheDocument();
  });

  it('displays product ratings', () => {
    render(<ProductsPage />);

    // Check rating is displayed
    expect(screen.getByText('4.5 (128 reviews)')).toBeInTheDocument();
  });

  it('displays stock status', () => {
    render(<ProductsPage />);

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('handles search with no results', () => {
    mockSearchProducts.mockReturnValue([]);

    render(<ProductsPage />);

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('calls fetchProducts on mount', () => {
    render(<ProductsPage />);

    expect(mockProductsStore.fetchProducts).toHaveBeenCalled();
  });

  it('displays correct number of products found', () => {
    render(<ProductsPage />);

    expect(screen.getByText('3 products found')).toBeInTheDocument();
  });

  it('displays singular form for one product', () => {
    const singleProductStore = {
      ...mockProductsStore,
      products: [mockProducts[0]],
    };

    (useProductsStore as jest.Mock).mockReturnValue(singleProductStore);

    render(<ProductsPage />);

    expect(screen.getByText('1 product found')).toBeInTheDocument();
  });

  it('handles product image display', () => {
    render(<ProductsPage />);

    const productImages = screen.getAllByAltText(/Premium Vodka|Classic Whiskey|Out of Stock Gin/);
    expect(productImages).toHaveLength(3);

    productImages.forEach((img) => {
      expect(img).toHaveAttribute('src');
    });
  });

  it('handles category display', () => {
    render(<ProductsPage />);

    expect(screen.getByText('vodka')).toBeInTheDocument();
    expect(screen.getByText('whiskey')).toBeInTheDocument();
    expect(screen.getByText('gin')).toBeInTheDocument();
  });
});
