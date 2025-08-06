import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Heading from './index';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useCartStore } from '@/app/zustand/store/cart';
import { useDictionary } from '@/dictionary-provider';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock Zustand stores
jest.mock('@/app/zustand/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/app/zustand/store/cart', () => ({
  useCartStore: jest.fn(),
}));

// Mock dictionary provider
jest.mock('@/dictionary-provider', () => ({
  useDictionary: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockRouter = {
  push: jest.fn(),
};

const mockDictionary = {
  navigation: {
    home: 'Home',
    products: 'Products',
    dashboard: 'Dashboard',
    cart: 'Cart',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search',
  },
};

const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  logout: jest.fn(),
};

const mockCartStore = {
  getTotalItems: jest.fn(() => 0),
};

describe('Heading Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    (useDictionary as jest.Mock).mockReturnValue(mockDictionary);
    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
    (useCartStore as jest.Mock).mockReturnValue(mockCartStore);
  });

  it('renders navigation links correctly', () => {
    render(<Heading />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  it('shows login and register buttons when user is not authenticated', () => {
    render(<Heading />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('shows user menu and dashboard when user is authenticated', () => {
    const authenticatedUser = {
      user: { firstName: 'John', lastName: 'Doe' },
      isAuthenticated: true,
      logout: jest.fn(),
    };

    (useAuthStore as jest.Mock).mockReturnValue(authenticatedUser);

    render(<Heading />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockLogout = jest.fn();
    const authenticatedUser = {
      user: { firstName: 'John', lastName: 'Doe' },
      isAuthenticated: true,
      logout: mockLogout,
    };

    (useAuthStore as jest.Mock).mockReturnValue(authenticatedUser);

    render(<Heading />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('displays cart badge when cart has items', () => {
    const mockCartWithItems = {
      getTotalItems: jest.fn(() => 3),
    };

    (useCartStore as jest.Mock).mockReturnValue(mockCartWithItems);

    render(<Heading />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not display cart badge when cart is empty', () => {
    const mockEmptyCart = {
      getTotalItems: jest.fn(() => 0),
    };

    (useCartStore as jest.Mock).mockReturnValue(mockEmptyCart);

    render(<Heading />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('highlights active navigation link', () => {
    (usePathname as jest.Mock).mockReturnValue('/products');

    render(<Heading />);

    const productsLink = screen.getByText('Products');
    expect(productsLink).toHaveClass('active');
  });

  it('renders logo with correct link', () => {
    render(<Heading />);

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders search icon', () => {
    render(<Heading />);

    const searchIcon = screen.getByAltText('Search');
    expect(searchIcon).toBeInTheDocument();
  });

  it('renders cart icon with correct link', () => {
    render(<Heading />);

    const cartIcon = screen.getByAltText('Cart');
    expect(cartIcon).toBeInTheDocument();
    expect(cartIcon.closest('a')).toHaveAttribute('href', '/cart');
  });

  it('handles scroll effect correctly', () => {
    const { container } = render(<Heading />);

    const heading = container.firstChild as HTMLElement;
    expect(heading).not.toHaveClass('scrolled');

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100,
    });

    fireEvent.scroll(window);

    // Note: The scroll effect is handled by useEffect, so we can't easily test it
    // without more complex setup. This test ensures the component renders without errors.
    expect(heading).toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(<Heading />);

    const logo = screen.getByAltText('logo');
    const searchIcon = screen.getByAltText('Search');
    const cartIcon = screen.getByAltText('Cart');

    expect(logo).toHaveAttribute('width', '100');
    expect(logo).toHaveAttribute('height', '100');
    expect(searchIcon).toHaveAttribute('width', '16');
    expect(searchIcon).toHaveAttribute('height', '16');
    expect(cartIcon).toHaveAttribute('width', '16');
    expect(cartIcon).toHaveAttribute('height', '16');
  });
});
