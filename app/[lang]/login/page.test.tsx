import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from './page';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import DictionaryProvider from '@/dictionary-provider';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Zustand store
jest.mock('@/app/zustand/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
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
  home: {
    heading: 'Premium Drinks Store',
    menu: {
      register: 'Login / Register',
    },
    hero: {
      title: 'Premium Alcoholic Beverages',
      subtitle: 'Discover the finest selection of spirits, wines, and craft beers',
      cta: 'Shop Now',
    },
  },
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
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account to continue',
      email: 'Email Address',
      password: 'Password',
      submit: 'Sign In',
      loading: 'Signing in...',
      noAccount: 'Don&apos;t have an account?',
      signUp: 'Sign up here',
      demoCredentials: 'Demo Credentials:',
      demoEmail: 'Email: demo@example.com',
      demoPassword: 'Password: password',
      success: 'Login successful!',
      genericError: 'Login failed. Please check your credentials.',
      unexpectedError: 'An unexpected error occurred.',
    },
  },
  validation: {
    email: 'Please enter a valid email address',
    minLength: 'Password must be at least 6 characters',
  },
  common: {
    successLogin: 'Login successful!',
    unexpectedError: 'An unexpected error occurred.',
  },
};

const mockLogin = jest.fn();

const mockAuthStore = {
  login: mockLogin,
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
  });

  const renderWithProvider = () => {
    return render(
      <DictionaryProvider dictionary={mockDictionary}>
        <LoginPage />
      </DictionaryProvider>,
    );
  };

  it('renders login form with all fields', () => {
    renderWithProvider();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('shows demo credentials', () => {
    renderWithProvider();

    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
    expect(screen.getByText('Email: demo@example.com')).toBeInTheDocument();
    expect(screen.getByText('Password: password')).toBeInTheDocument();
  });

  it('shows link to register page', () => {
    renderWithProvider();

    const registerLink = screen.getByText('Sign up here');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('validates email format', async () => {
    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true });

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('shows success message and redirects on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('shows generic error message when login fails without specific message', async () => {
    mockLogin.mockResolvedValue({ success: false });

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    });
  });

  it('shows error message on unexpected error', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred.');
    });
  });

  it('disables submit button while loading', () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled();
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('clears validation errors when user starts typing', async () => {
    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');

    // Trigger validation error
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'test@' } });

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  it('has correct form accessibility attributes', () => {
    renderWithProvider();

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  it('shows loading state in submit button', async () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithProvider();

    const form = screen.getByRole('form');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });
});
