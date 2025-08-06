import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simulate authentication
          if (email === 'demo@example.com' && password === 'password') {
            const user: User = {
              id: '1',
              email: 'demo@example.com',
              firstName: 'John',
              lastName: 'Doe',
              phone: '+1234567890',
              address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
              },
              createdAt: new Date().toISOString(),
            };

            set({ user, isAuthenticated: true, isLoading: false });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: 'Invalid credentials' };
          }
        } catch {
          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });

        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch {
          set({ isLoading: false });
          return { success: false, error: 'Registration failed' };
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true });

        try {
          // Mock API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const currentUser = get().user;
          if (!currentUser) {
            set({ isLoading: false });
            return { success: false, error: 'User not found' };
          }

          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser, isLoading: false });
          return { success: true };
        } catch {
          set({ isLoading: false });
          return { success: false, error: 'Profile update failed' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
