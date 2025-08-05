import products from '../data/products.json';
import categories from '../data/categories.json';
import users from '../data/users.json';
import orders from '../data/orders.json';
import reviews from '../data/reviews.json';
import coupons from '../data/coupons.json';
import settings from '../data/settings.json';

// Type definitions for the mock data
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  volume: number;
  category: string;
  image: string;
  ingredients?: string[];
  alcoholContent: number;
  origin: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  salePrice: number | null;
  discount: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  lastLogin: string;
  isVerified: boolean;
  preferences: {
    newsletter: boolean;
    marketing: boolean;
    language: string;
  };
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
  trackingNumber: string | null;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface StoreSettings {
  store: {
    name: string;
    description: string;
    currency: string;
    taxRate: number;
    shippingCost: number;
    freeShippingThreshold: number;
    contactEmail: string;
    contactPhone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  features: {
    reviews: boolean;
    wishlist: boolean;
    coupons: boolean;
    newsletter: boolean;
    guestCheckout: boolean;
    multiplePaymentMethods: boolean;
    orderTracking: boolean;
    emailNotifications: boolean;
  };
  paymentMethods: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }>;
  shippingMethods: Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    enabled: boolean;
  }>;
  orderStatuses: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

// Mock database class
export class MockDatabase {
  private static instance: MockDatabase;
  private _products: Product[] = products as Product[];
  private _categories: Category[] = categories as Category[];
  private _users: User[] = users as User[];
  private _orders: Order[] = orders as Order[];
  private _reviews: Review[] = reviews as Review[];
  private _coupons: Coupon[] = coupons as Coupon[];
  private _settings: StoreSettings = settings as StoreSettings;

  private constructor() {}

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Product methods
  getProducts(): Product[] {
    return this._products;
  }

  getProductById(id: string): Product | undefined {
    return this._products.find(product => product.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this._products.filter(product => product.category === category);
  }

  getFeaturedProducts(): Product[] {
    return this._products.filter(product => product.featured);
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this._products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Category methods
  getCategories(): Category[] {
    return this._categories;
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories.find(category => category.id === id);
  }

  // User methods
  getUsers(): User[] {
    return this._users;
  }

  getUserById(id: string): User | undefined {
    return this._users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this._users.find(user => user.email === email);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): User {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    this._users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = this._users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    
    this._users[userIndex] = { ...this._users[userIndex], ...updates };
    return this._users[userIndex];
  }

  // Order methods
  getOrders(): Order[] {
    return this._orders;
  }

  getOrderById(id: string): Order | undefined {
    return this._orders.find(order => order.id === id);
  }

  getUserOrders(userId: string): Order[] {
    return this._orders.filter(order => order.userId === userId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._orders.push(newOrder);
    return newOrder;
  }

  updateOrderStatus(id: string, status: string): Order | undefined {
    const orderIndex = this._orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return undefined;
    
    this._orders[orderIndex] = { 
      ...this._orders[orderIndex], 
      status,
      updatedAt: new Date().toISOString()
    };
    return this._orders[orderIndex];
  }

  // Review methods
  getReviews(): Review[] {
    return this._reviews;
  }

  getProductReviews(productId: string): Review[] {
    return this._reviews.filter(review => review.productId === productId);
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    this._reviews.push(newReview);
    return newReview;
  }

  // Coupon methods
  getCoupons(): Coupon[] {
    return this._coupons;
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this._coupons.find(coupon => coupon.code === code && coupon.active);
  }

  validateCoupon(code: string, orderTotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupon = this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      return { valid: false, error: 'Coupon has expired or is not yet valid' };
    }

    if (orderTotal < coupon.minOrder) {
      return { valid: false, error: `Minimum order amount is $${coupon.minOrder}` };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    return { valid: true, coupon };
  }

  // Settings methods
  getSettings(): StoreSettings {
    return this._settings;
  }

  // Utility methods
  calculateTax(subtotal: number): number {
    return subtotal * this._settings.store.taxRate;
  }

  calculateShipping(subtotal: number): number {
    return subtotal >= this._settings.store.freeShippingThreshold ? 0 : this._settings.store.shippingCost;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._settings.store.currency,
    }).format(price);
  }
}

// Export singleton instance
export const mockDB = MockDatabase.getInstance();

// Helper functions
export const getProducts = () => mockDB.getProducts();
export const getProductById = (id: string) => mockDB.getProductById(id);
export const getCategories = () => mockDB.getCategories();
export const getUsers = () => mockDB.getUsers();
export const getOrders = () => mockDB.getOrders();
export const getReviews = () => mockDB.getReviews();
export const getSettings = () => mockDB.getSettings(); 