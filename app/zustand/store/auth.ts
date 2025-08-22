import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
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
  reset: () => void;
  getAuthState: () => { user: User | null; isAuthenticated: boolean; isLoading: boolean };
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        console.log('Login attempt for:', email);
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
              dateOfBirth: new Date('1990-01-01'),
              address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
              },
              createdAt: new Date().toISOString(),
            };

            console.log('Login successful, setting user:', user);
            set({ user, isAuthenticated: true, isLoading: false });
            return { success: true };
          } else {
            console.log('Login failed - invalid credentials');
            set({ isLoading: false });
            return { success: false, error: 'Invalid credentials' };
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        }
      },

      logout: () => {
        console.log('Logout called - clearing auth state');
        
        // Clear all auth state
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
        
        // Clear any stored tokens or session data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();
        }
        
        console.log('Logout completed - auth state cleared');
      },

      // Add a reset function to clear all state
      reset: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
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
            dateOfBirth: userData.dateOfBirth,
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

      getAuthState: () => {
        return {
          user: get().user,
          isAuthenticated: get().isAuthenticated,
          isLoading: get().isLoading,
        };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure state is properly initialized after rehydration
        if (state) {
          // If no user, ensure we're not authenticated
          if (!state.user) {
            state.isAuthenticated = false;
            state.isLoading = false;
          }
        }
      },
    },
  ),
);
