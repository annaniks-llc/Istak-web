import { create } from 'zustand';
import { CartItem } from './cart';

export interface OrderItem extends CartItem {
  productId: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (orderData: CreateOrderData) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

interface CreateOrderData {
  userId: string;
  items: CartItem[];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: Order['paymentMethod'];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (orderData: CreateOrderData) => {
    set({ isLoading: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now
      
      const order: Order = {
        id: orderId,
        userId: orderData.userId,
        items: orderData.items.map(item => ({
          ...item,
          productId: item.id
        })),
        totalAmount: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        status: 'pending',
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date().toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };
      
      set(state => ({
        orders: [...state.orders, order],
        currentOrder: order,
        isLoading: false
      }));
      
      return { success: true, orderId: order.id };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Failed to create order' };
    }
  },

  getOrderById: (orderId: string) => {
    const { orders } = get();
    return orders.find(order => order.id === orderId);
  },

  getUserOrders: (userId: string) => {
    const { orders } = get();
    return orders.filter(order => order.userId === userId);
  },

  updateOrderStatus: (orderId: string, status: Order['status']) => {
    set(state => ({
      orders: state.orders.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    }));
  }
})); 