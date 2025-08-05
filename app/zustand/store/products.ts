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
    image: '/img/png/drink.png',
    ingredients: ['Grain', 'Water'],
    alcoholContent: 40,
    origin: 'Russia',
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Classic Martini',
    description: 'A sophisticated blend of gin and vermouth, garnished with an olive or lemon twist.',
    price: 12.99,
    volume: 200,
    category: 'cocktail',
    image: '/img/png/drink.png',
    ingredients: ['Gin', 'Dry Vermouth', 'Olive'],
    alcoholContent: 35,
    origin: 'United States',
    inStock: true,
    rating: 4.8,
    reviews: 95
  },
  {
    id: '3',
    name: 'Single Malt Whiskey',
    description: 'Aged for 12 years in oak barrels, offering rich flavors of vanilla, oak, and spice.',
    price: 89.99,
    volume: 750,
    category: 'whiskey',
    image: '/img/png/drink.png',
    ingredients: ['Malted Barley', 'Water'],
    alcoholContent: 43,
    origin: 'Scotland',
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
    name: 'Aged Rum',
    description: 'Smooth Caribbean rum aged for 8 years, with notes of caramel and tropical fruits.',
    price: 65.99,
    volume: 750,
    category: 'rum',
    image: '/img/png/drink.png',
    ingredients: ['Sugarcane', 'Water'],
    alcoholContent: 40,
    origin: 'Jamaica',
    inStock: true,
    rating: 4.3,
    reviews: 87
  },
  {
    id: '5',
    name: 'London Dry Gin',
    description: 'Classic London dry gin with juniper berries and traditional botanicals.',
    price: 38.99,
    volume: 750,
    category: 'gin',
    image: '/img/png/drink.png',
    ingredients: ['Juniper', 'Botanicals', 'Grain'],
    alcoholContent: 47,
    origin: 'England',
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '6',
    name: 'Premium Tequila',
    description: '100% agave tequila with smooth, earthy flavors and a clean finish.',
    price: 72.99,
    volume: 750,
    category: 'tequila',
    image: '/img/png/drink.png',
    ingredients: ['Blue Agave'],
    alcoholContent: 40,
    origin: 'Mexico',
    inStock: true,
    rating: 4.4,
    reviews: 112
  },
  {
    id: '7',
    name: 'Red Wine Blend',
    description: 'Rich and full-bodied red wine with notes of dark fruit and oak.',
    price: 28.99,
    volume: 750,
    category: 'wine',
    image: '/img/png/drink.png',
    ingredients: ['Red Grapes'],
    alcoholContent: 13.5,
    origin: 'France',
    inStock: true,
    rating: 4.2,
    reviews: 89
  },
  {
    id: '8',
    name: 'Craft IPA',
    description: 'Hoppy craft beer with citrus notes and a balanced bitterness.',
    price: 8.99,
    volume: 330,
    category: 'beer',
    image: '/img/png/drink.png',
    ingredients: ['Malt', 'Hops', 'Yeast', 'Water'],
    alcoholContent: 6.5,
    origin: 'United States',
    inStock: true,
    rating: 4.1,
    reviews: 234
  },
  {
    id: '9',
    name: 'Espresso Martini',
    description: 'A sophisticated cocktail combining vodka, coffee liqueur, and fresh espresso.',
    price: 15.99,
    volume: 200,
    category: 'cocktail',
    image: '/img/png/drink.png',
    ingredients: ['Vodka', 'Coffee Liqueur', 'Espresso'],
    alcoholContent: 30,
    origin: 'United Kingdom',
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '10',
    name: 'Bourbon Whiskey',
    description: 'Smooth American bourbon with caramel and vanilla notes, aged in charred oak.',
    price: 55.99,
    volume: 750,
    category: 'whiskey',
    image: '/img/png/drink.png',
    ingredients: ['Corn', 'Rye', 'Barley'],
    alcoholContent: 45,
    origin: 'United States',
    inStock: true,
    rating: 4.6,
    reviews: 178
  }
];

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ products: mockProducts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
    }
  },

  getProductById: (id: string) => {
    const { products } = get();
    return products.find(product => product.id === id);
  },

  getProductsByCategory: (category: Product['category']) => {
    const { products } = get();
    return products.filter(product => product.category === category);
  },

  searchProducts: (query: string) => {
    const { products } = get();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
})); 