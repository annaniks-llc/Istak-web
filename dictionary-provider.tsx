'use client';

import { createContext, useContext } from 'react';
import { getDictionary } from './get-dictionary';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const DictionaryContext = createContext<Dictionary | null>(null);

export default function DictionaryProvider({ dictionary, children }: { dictionary: Dictionary; children: React.ReactNode }) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>;
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);

  // Provide a fallback dictionary to prevent undefined errors
  if (dictionary === null) {
    console.warn('useDictionary hook must be used within DictionaryProvider');
    return {
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
    } as Dictionary;
  }

  return dictionary;
}
