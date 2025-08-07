import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  volume: number;
  category: 'vodka' | 'cocktail' | 'whiskey' | 'rum' | 'gin' | 'tequila' | 'wine' | 'beer';
  image: string;
  ingredients?: string[];
  alcoholContent: number;
  origin: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: Product['category']) => Product[];
  searchProducts: (query: string) => Product[];
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Vodka',
    description: 'Smooth and clean premium vodka with a crisp finish. Perfect for cocktails or sipping neat.',
    price: 45.99,
    volume: 750,
    category: 'vodka',
    image: '/img/png/drink1.png',
    ingredients: ['Grain', 'Water'],
    alcoholContent: 40,
    origin: 'Russia',
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Classic Martini',
    description: 'A sophisticated blend of gin and vermouth, garnished with an olive or lemon twist.',
    price: 12.99,
    volume: 200,
    category: 'cocktail',
    image: '/img/png/drink2.png',
    ingredients: ['Gin', 'Dry Vermouth', 'Olive'],
    alcoholContent: 35,
    origin: 'United States',
    inStock: true,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: 'Single Malt Whiskey',
    description: 'Aged for 12 years in oak barrels, offering rich flavors of vanilla, oak, and spice.',
    price: 89.99,
    volume: 750,
    category: 'whiskey',
    image: '/img/png/drink3.png',
    ingredients: ['Malted Barley', 'Water'],
    alcoholContent: 43,
    origin: 'Scotland',
    inStock: true,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: '4',
    name: 'Aged Rum',
    description: 'Smooth Caribbean rum aged for 8 years, with notes of caramel and tropical fruits.',
    price: 65.99,
    volume: 750,
    category: 'rum',
    image: '/img/png/drink4.png',
    ingredients: ['Sugarcane', 'Water'],
    alcoholContent: 40,
    origin: 'Jamaica',
    inStock: true,
    rating: 4.3,
    reviews: 87,
  }
 
];

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ products: mockProducts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
    }
  },

  getProductById: (id: string) => {
    const { products } = get();
    return products.find((product) => product.id === id);
  },

  getProductsByCategory: (category: Product['category']) => {
    const { products } = get();
    return products.filter((product) => product.category === category);
  },

  searchProducts: (query: string) => {
    const { products } = get();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery),
    );
  },
}));
