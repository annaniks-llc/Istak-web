import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CartPage from './page';
import { useCartStore } from '@/app/zustand/store/cart';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useDictionary } from '@/dictionary-provider';
import toast from 'react-hot-toast';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Zustand stores
jest.mock('@/app/zustand/store/cart', () => ({
  useCartStore: jest.fn(),
}));

jest.mock('@/app/zustand/store/auth', () => ({
  useAuthStore: jest.fn(),
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

const mockRouter = {
  push: jest.fn(),
};

const mockDictionary = {
  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    emptySubtitle: 'Start shopping to add items to your cart',
    continueShopping: 'Continue Shopping',
    item: {
      quantity: 'Quantity',
      total: 'Total',
      remove: 'Remove',
    },
    summary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'Tax',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'Proceed to Checkout',
    },
    actions: {
      clearCart: 'Clear Cart',
    },
  },
};

const mockCartItems = [
  {
    id: '1',
    name: 'Premium Vodka',
    price: 45.99,
    volume: 750,
    image: '/img/png/drink.png',
    quantity: 2,
  },
  {
    id: '2',
    name: 'Classic Whiskey',
    price: 65.99,
    volume: 750,
    image: '/img/png/drink.png',
    quantity: 1,
  },
];

const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();
const mockGetTotalItems = jest.fn();
const mockGetTotalPrice = jest.fn();

const mockCartStore = {
  items: mockCartItems,
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  clearCart: mockClearCart,
  getTotalItems: mockGetTotalItems,
  getTotalPrice: mockGetTotalPrice,
};

const mockAuthStore = {
  isAuthenticated: true,
};

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDictionary as jest.Mock).mockReturnValue(mockDictionary);
    (useCartStore as jest.Mock).mockReturnValue(mockCartStore);
    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
    mockGetTotalItems.mockReturnValue(3);
    mockGetTotalPrice.mockReturnValue(157.97);
  });

  it('renders cart page with header', () => {
    render(<CartPage />);
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('3 items in your cart')).toBeInTheDocument();
  });

  it('renders all cart items', () => {
    render(<CartPage />);
    
    expect(screen.getByText('Premium Vodka')).toBeInTheDocument();
    expect(screen.getByText('Classic Whiskey')).toBeInTheDocument();
  });

  it('displays item details correctly', () => {
    render(<CartPage />);
    
    // Check item information is displayed
    expect(screen.getByText('Premium Vodka')).toBeInTheDocument();
    expect(screen.getByText('750ml')).toBeInTheDocument();
    expect(screen.getByText('$45.99')).toBeInTheDocument();
    expect(screen.getByText('$91.98')).toBeInTheDocument(); // 2 * 45.99
  });

  it('displays item quantities', () => {
    render(<CartPage />);
    
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Premium Vodka quantity
    expect(screen.getByText('1')).toBeInTheDocument(); // Classic Whiskey quantity
  });

  it('increases item quantity when plus button is clicked', () => {
    render(<CartPage />);
    
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]); // First item (Premium Vodka)
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('decreases item quantity when minus button is clicked', () => {
    render(<CartPage />);
    
    const minusButtons = screen.getAllByText('-');
    fireEvent.click(minusButtons[0]); // First item (Premium Vodka)
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('removes item when quantity becomes zero', () => {
    render(<CartPage />);
    
    const minusButtons = screen.getAllByText('-');
    fireEvent.click(minusButtons[1]); // Second item (Classic Whiskey) with quantity 1
    
    expect(mockRemoveItem).toHaveBeenCalledWith('2');
    expect(toast.success).toHaveBeenCalledWith('Item removed from cart');
  });

  it('removes item when remove button is clicked', () => {
    render(<CartPage />);
    
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalledWith('Item removed from cart');
  });

  it('clears cart when clear cart button is clicked', () => {
    render(<CartPage />);
    
    const clearCartButton = screen.getByText('Clear Cart');
    fireEvent.click(clearCartButton);
    
    expect(mockClearCart).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Cart cleared');
  });

  it('displays order summary correctly', () => {
    render(<CartPage />);
    
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Items (3):')).toBeInTheDocument();
    expect(screen.getByText('$157.97')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('Free')).toBeInTheDocument(); // Shipping
    expect(screen.getByText('$12.64')).toBeInTheDocument(); // Tax (8% of 157.97)
    expect(screen.getByText('$170.61')).toBeInTheDocument(); // Total
  });

  it('proceeds to checkout when checkout button is clicked', () => {
    render(<CartPage />);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout');
  });

  it('redirects to login if user is not authenticated during checkout', () => {
    const unauthenticatedAuthStore = {
      isAuthenticated: false,
    };
    
    (useAuthStore as jest.Mock).mockReturnValue(unauthenticatedAuthStore);
    
    render(<CartPage />);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);
    
    expect(toast.error).toHaveBeenCalledWith('Please log in to checkout');
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('shows error if cart is empty during checkout', () => {
    const emptyCartStore = {
      ...mockCartStore,
      items: [],
    };
    
    (useCartStore as jest.Mock).mockReturnValue(emptyCartStore);
    
    render(<CartPage />);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);
    
    expect(toast.error).toHaveBeenCalledWith('Your cart is empty');
  });

  it('redirects to products when continue shopping is clicked', () => {
    render(<CartPage />);
    
    const continueShoppingButton = screen.getByText('Continue Shopping');
    fireEvent.click(continueShoppingButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/products');
  });

  it('shows empty cart state when cart is empty', () => {
    const emptyCartStore = {
      ...mockCartStore,
      items: [],
    };
    
    (useCartStore as jest.Mock).mockReturnValue(emptyCartStore);
    
    render(<CartPage />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start shopping to add items to your cart')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('displays correct item count in header', () => {
    mockGetTotalItems.mockReturnValue(1);
    
    render(<CartPage />);
    
    expect(screen.getByText('1 item in your cart')).toBeInTheDocument();
  });

  it('displays correct item count for multiple items', () => {
    mockGetTotalItems.mockReturnValue(5);
    
    render(<CartPage />);
    
    expect(screen.getByText('5 items in your cart')).toBeInTheDocument();
  });

  it('calculates item totals correctly', () => {
    render(<CartPage />);
    
    // Premium Vodka: 2 * $45.99 = $91.98
    expect(screen.getByText('$91.98')).toBeInTheDocument();
    // Classic Whiskey: 1 * $65.99 = $65.99
    expect(screen.getByText('$65.99')).toBeInTheDocument();
  });

  it('displays item images', () => {
    render(<CartPage />);
    
    const itemImages = screen.getAllByAltText(/Premium Vodka|Classic Whiskey/);
    expect(itemImages).toHaveLength(2);
    
    itemImages.forEach(img => {
      expect(img).toHaveAttribute('src');
    });
  });

  it('handles quantity controls correctly', () => {
    render(<CartPage />);
    
    const minusButtons = screen.getAllByText('-');
    const plusButtons = screen.getAllByText('+');
    const quantities = screen.getAllByText(/1|2/);
    
    expect(minusButtons).toHaveLength(2);
    expect(plusButtons).toHaveLength(2);
    expect(quantities).toHaveLength(2);
  });

  it('displays tax calculation correctly', () => {
    render(<CartPage />);
    
    // Tax should be 8% of subtotal
    const taxAmount = (157.97 * 0.08).toFixed(2);
    expect(screen.getByText(`$${taxAmount}`)).toBeInTheDocument();
  });

  it('displays total calculation correctly', () => {
    render(<CartPage />);
    
    // Total should be subtotal + tax (shipping is free)
    const subtotal = 157.97;
    const tax = subtotal * 0.08;
    const total = (subtotal + tax).toFixed(2);
    expect(screen.getByText(`$${total}`)).toBeInTheDocument();
  });

  it('handles multiple items with different quantities', () => {
    const multipleItemsCart = {
      ...mockCartStore,
      items: [
        { ...mockCartItems[0], quantity: 3 },
        { ...mockCartItems[1], quantity: 2 },
      ],
    };
    
    (useCartStore as jest.Mock).mockReturnValue(multipleItemsCart);
    
    render(<CartPage />);
    
    expect(screen.getByText('3')).toBeInTheDocument(); // First item quantity
    expect(screen.getByText('2')).toBeInTheDocument(); // Second item quantity
  });

  it('shows correct total for multiple items', () => {
    const multipleItemsCart = {
      ...mockCartStore,
      items: [
        { ...mockCartItems[0], quantity: 3 },
        { ...mockCartItems[1], quantity: 2 },
      ],
    };
    
    (useCartStore as jest.Mock).mockReturnValue(multipleItemsCart);
    
    render(<CartPage />);
    
    // Premium Vodka: 3 * $45.99 = $137.97
    expect(screen.getByText('$137.97')).toBeInTheDocument();
    // Classic Whiskey: 2 * $65.99 = $131.98
    expect(screen.getByText('$131.98')).toBeInTheDocument();
  });

  it('handles edge case with zero items', () => {
    const zeroItemsCart = {
      ...mockCartStore,
      items: [],
    };
    
    mockGetTotalItems.mockReturnValue(0);
    mockGetTotalPrice.mockReturnValue(0);
    
    (useCartStore as jest.Mock).mockReturnValue(zeroItemsCart);
    
    render(<CartPage />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
}); 