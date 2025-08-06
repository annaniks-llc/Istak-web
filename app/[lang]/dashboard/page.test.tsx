import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from './page';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useOrdersStore } from '@/app/zustand/store/orders';
import { useDictionary } from '@/dictionary-provider';
import toast from 'react-hot-toast';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Zustand stores
jest.mock('@/app/zustand/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/app/zustand/store/orders', () => ({
  useOrdersStore: jest.fn(),
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
  dashboard: {
    title: 'User Dashboard',
    tabs: {
      profile: 'Profile',
      orders: 'Orders',
    },
    profile: {
      title: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Address',
      street: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Profile updated successfully!',
    },
    orders: {
      title: 'Order History',
      noOrders: 'No orders found',
    },
  },
  navigation: {
    logout: 'Logout',
    products: 'Products',
  },
  common: {
    cancel: 'Cancel',
    edit: 'Edit',
  },
};

const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  },
};

const mockOrders = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      {
        productId: '1',
        name: 'Premium Vodka',
        price: 45.99,
        quantity: 2,
        total: 91.98,
      },
    ],
    totalAmount: 91.98,
    status: 'delivered',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: 'ORD-002',
    userId: '1',
    items: [
      {
        productId: '2',
        name: 'Classic Whiskey',
        price: 65.99,
        quantity: 1,
        total: 65.99,
      },
    ],
    totalAmount: 65.99,
    status: 'pending',
    createdAt: '2024-01-20T10:15:00Z',
  },
];

const mockUpdateProfile = jest.fn();
const mockLogout = jest.fn();
const mockGetUserOrders = jest.fn();

const mockAuthStore = {
  user: mockUser,
  isAuthenticated: true,
  logout: mockLogout,
  updateProfile: mockUpdateProfile,
};

const mockOrdersStore = {
  getUserOrders: mockGetUserOrders,
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDictionary as jest.Mock).mockReturnValue(mockDictionary);
    (useAuthStore as jest.Mock).mockReturnValue(mockAuthStore);
    (useOrdersStore as jest.Mock).mockReturnValue(mockOrdersStore);
    mockGetUserOrders.mockReturnValue(mockOrders);
  });

  it('renders dashboard with header', () => {
    render(<DashboardPage />);

    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders tabs correctly', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Orders (2)')).toBeInTheDocument();
  });

  it('shows profile tab by default', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('switches to orders tab when clicked', () => {
    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (2)');
    fireEvent.click(ordersTab);

    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.queryByText('Personal Information')).not.toBeInTheDocument();
  });

  it('displays user information in profile form', () => {
    render(<DashboardPage />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('NY')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10001')).toBeInTheDocument();
  });

  it('enables form editing when edit button is clicked', () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('validates form fields when submitted', async () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: '' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true });

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
      });
    });
  });

  it('shows success message on successful profile update', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true });

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully!');
    });
  });

  it('shows error message on failed profile update', async () => {
    mockUpdateProfile.mockResolvedValue({
      success: false,
      error: 'Update failed',
    });

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('disables form fields when not editing', () => {
    render(<DashboardPage />);

    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');

    expect(firstNameInput).toBeDisabled();
    expect(lastNameInput).toBeDisabled();
  });

  it('enables form fields when editing', () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');

    expect(firstNameInput).not.toBeDisabled();
    expect(lastNameInput).not.toBeDisabled();
  });

  it('cancels editing when cancel button is clicked', () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('displays order history correctly', () => {
    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (2)');
    fireEvent.click(ordersTab);

    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Order #ORD-002')).toBeInTheDocument();
  });

  it('displays order details correctly', () => {
    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (2)');
    fireEvent.click(ordersTab);

    expect(screen.getByText('Total: $91.98')).toBeInTheDocument();
    expect(screen.getByText('Items: 1')).toBeInTheDocument();
    expect(screen.getByText('delivered')).toBeInTheDocument();
  });

  it('shows empty orders message when no orders exist', () => {
    mockGetUserOrders.mockReturnValue([]);

    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (0)');
    fireEvent.click(ordersTab);

    expect(screen.getByText('No orders found')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('redirects to products when shop button is clicked', () => {
    mockGetUserOrders.mockReturnValue([]);

    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (0)');
    fireEvent.click(ordersTab);

    const shopButton = screen.getByText('Products');
    fireEvent.click(shopButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/products');
  });

  it('calls logout when logout button is clicked', () => {
    render(<DashboardPage />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('redirects to login if user is not authenticated', () => {
    const unauthenticatedAuthStore = {
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
      updateProfile: mockUpdateProfile,
    };

    (useAuthStore as jest.Mock).mockReturnValue(unauthenticatedAuthStore);

    render(<DashboardPage />);

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('validates email format', async () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const emailInput = screen.getByDisplayValue('john@example.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates minimum length for names', async () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'J' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('validates address fields', async () => {
    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const streetInput = screen.getByDisplayValue('123 Main St');
    fireEvent.change(streetInput, { target: { value: '123' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Street address must be at least 5 characters')).toBeInTheDocument();
    });
  });

  it('shows loading state when saving profile', () => {
    mockUpdateProfile.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('handles user without address information', () => {
    const userWithoutAddress = {
      ...mockUser,
      address: null,
    };

    const authStoreWithoutAddress = {
      ...mockAuthStore,
      user: userWithoutAddress,
    };

    (useAuthStore as jest.Mock).mockReturnValue(authStoreWithoutAddress);

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Form should render without errors even without address
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('handles user without phone number', () => {
    const userWithoutPhone = {
      ...mockUser,
      phone: null,
    };

    const authStoreWithoutPhone = {
      ...mockAuthStore,
      user: userWithoutPhone,
    };

    (useAuthStore as jest.Mock).mockReturnValue(authStoreWithoutPhone);

    render(<DashboardPage />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Form should render without errors even without phone
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('displays order dates correctly', () => {
    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (2)');
    fireEvent.click(ordersTab);

    // Check that order dates are displayed
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/1\/20\/2024/)).toBeInTheDocument();
  });

  it('handles multiple orders with different statuses', () => {
    render(<DashboardPage />);

    const ordersTab = screen.getByText('Orders (2)');
    fireEvent.click(ordersTab);

    expect(screen.getByText('delivered')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});
