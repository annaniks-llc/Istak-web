import { create } from 'zustand';

export interface Product {
  id: string;
  name: string | { en: string; hy: string; ru: string };
  description: string | { en: string; hy: string; ru: string };
  price: number;
  volume: number;
  category: 'vodka' | 'cocktail' | 'whiskey' | 'rum' | 'gin' | 'tequila' | 'wine' | 'beer';
  image: string;
  ingredients?: string[];
  alcoholContent: number;
  origin: string | { en: string; hy: string; ru: string };
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
    name: {
      en: 'Premium Vodka',
      hy: 'Պրեմիում Օղի',
      ru: 'Премиум Водка'
    },
    description: {
      en: 'Smooth and clean premium vodka with a crisp finish. Perfect for cocktails or sipping neat.',
      hy: 'Հարթ և մաքուր պրեմիում օղի կտրուկ ավարտով: Կատարյալ է կոկտեյլների կամ մաքուր խմելու համար:',
      ru: 'Гладкая и чистая премиум водка с хрустящим финишем. Идеально подходит для коктейлей или употребления в чистом виде.'
    },
    price: 45.99,
    volume: 750,
    category: 'vodka',
    image: '/img/png/drink1.png',
    ingredients: ['Grain', 'Water'],
    alcoholContent: 40,
    origin: {
      en: 'Armenia',
      hy: 'Հայաստան',
      ru: 'Армения'
    },
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: {
      en: 'Classic Martini',
      hy: 'Դասական Մարտինի',
      ru: 'Классический Мартини'
    },
    description: {
      en: 'A sophisticated blend of gin and vermouth, garnished with an olive or lemon twist.',
      hy: 'Դժինի և վերմուտի նրբագույն խառնուրդ, զարդարված ձիթապտղով կամ կիտրոնի պտղով:',
      ru: 'Изысканная смесь джина и вермута, украшенная оливкой или лимонной цедрой.'
    },
    price: 12.99,
    volume: 200,
    category: 'cocktail',
    image: '/img/png/drink2.png',
    ingredients: ['Gin', 'Dry Vermouth', 'Olive'],
    alcoholContent: 35,
    origin: {
      en: 'United States',
      hy: 'ԱՄՆ',
      ru: 'США'
    },
    inStock: true,
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: {
      en: 'Single Malt Whiskey',
      hy: 'Միակ Մալտ Ուիսկի',
      ru: 'Односолодовый Виски'
    },
    description: {
      en: 'Aged for 12 years in oak barrels, offering rich flavors of vanilla, oak, and spice.',
      hy: '12 տարի հասած կաղնու տակառներում, առաջարկում է վանիլի, կաղնու և համեմունքների հարուստ համեր:',
      ru: 'Выдержанный 12 лет в дубовых бочках, предлагает богатые вкусы ванили, дуба и специй.'
    },
    price: 89.99,
    volume: 750,
    category: 'whiskey',
    image: '/img/png/drink3.png',
    ingredients: ['Malted Barley', 'Water'],
    alcoholContent: 43,
    origin: {
      en: 'Scotland',
      hy: 'Շոտլանդիա',
      ru: 'Шотландия'
    },
    inStock: true,
    rating: 4.7,
    reviews: 203,
  },
  {
    id: '4',
    name: {
      en: 'Aged Rum',
      hy: 'Հասած Ռոմ',
      ru: 'Выдержанный Ром'
    },
    description: {
      en: 'Smooth Caribbean rum aged for 8 years, with notes of caramel and tropical fruits.',
      hy: 'Հարթ կարիբյան ռոմ 8 տարի հասած, կարամելի և արևադարձային մրգերի նոտաներով:',
      ru: 'Гладкий карибский ром, выдержанный 8 лет, с нотами карамели и тропических фруктов.'
    },
    price: 65.99,
    volume: 750,
    category: 'rum',
    image: '/img/png/drink4.png',
    ingredients: ['Sugarcane', 'Water'],
    alcoholContent: 40,
    origin: {
      en: 'Jamaica',
      hy: 'Ջամայկա',
      ru: 'Ямайка'
    },
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
      
      // If products are already loaded, don't reload
      const currentProducts = get().products;
      if (currentProducts.length > 0) {
        set({ isLoading: false });
        return;
      }
      
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
      (product) => {
        const name = typeof product.name === 'string' ? product.name : product.name.en;
        const description = typeof product.description === 'string' ? product.description : product.description.en;
        return (
          name.toLowerCase().includes(lowercaseQuery) ||
          description.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery)
        );
      }
    );
  },
}));
