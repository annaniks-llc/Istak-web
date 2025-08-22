export interface CocktailPricing {
  price: number;
  currency: string;
  currencySymbol: string;
  region: string;
  taxRate: number;
  discount: number;
}

export interface RegionalPricing {
  AM: CocktailPricing;
  RU: CocktailPricing;
  US: CocktailPricing;
  EU: CocktailPricing;
}

export interface RegionalAvailability {
  AM: boolean;
  RU: boolean;
  US: boolean;
  EU: boolean;
}

export const REGIONS = {
  AM: 'AM',
  RU: 'RU',
  US: 'US',
  EU: 'EU'
} as const;

export type Region = keyof typeof REGIONS;

export const REGION_INFO = {
  [REGIONS.AM]: {
    name: 'Armenia',
    currency: 'AMD',
    currencySymbol: '֏',
    locale: 'hy-AM',
    taxRate: 0.20,
    language: 'hy'
  },
  [REGIONS.RU]: {
    name: 'Russia',
    currency: 'RUB',
    currencySymbol: '₽',
    locale: 'ru-RU',
    taxRate: 0.18,
    language: 'ru'
  },
  [REGIONS.US]: {
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
    taxRate: 0.08,
    language: 'en'
  },
  [REGIONS.EU]: {
    name: 'European Union',
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'en-EU',
    taxRate: 0.21,
    language: 'en'
  }
} as const;

/**
 * Detect user region based on language parameter
 */
export function detectRegionFromLanguage(lang: string): Region {
  switch (lang) {
    case 'hy':
      return REGIONS.AM;
    case 'ru':
      return REGIONS.RU;
    case 'en':
      return REGIONS.US;
    default:
      return REGIONS.AM; // Default fallback
  }
}

/**
 * Get regional pricing information for a cocktail
 */
export function getRegionalPricing(
  cocktail: { pricing: RegionalPricing },
  region: Region
): CocktailPricing | null {
  const pricing = cocktail.pricing[region];
  if (!pricing) return null;
  
  return pricing;
}

/**
 * Calculate final price with discount and tax
 */
export function calculateFinalPrice(pricing: CocktailPricing): {
  discountedPrice: number;
  priceWithTax: number;
  savings: number;
  taxAmount: number;
} {
  const discountedPrice = pricing.price * (1 - pricing.discount);
  const priceWithTax = discountedPrice * (1 + pricing.taxRate);
  const savings = pricing.price - discountedPrice;
  const taxAmount = discountedPrice * pricing.taxRate;
  
  return {
    discountedPrice,
    priceWithTax,
    savings,
    taxAmount
  };
}

/**
 * Format price according to regional standards
 */
export function formatPrice(price: number, region: Region): string {
  const regionInfo = REGION_INFO[region];
  
  if (!regionInfo) {
    return `${price} ${region}`;
  }

  try {
    const formattedPrice = price.toLocaleString(regionInfo.locale, {
      minimumFractionDigits: region === REGIONS.AM || region === REGIONS.RU ? 0 : 2,
      maximumFractionDigits: region === REGIONS.AM || region === REGIONS.RU ? 0 : 2
    });

    if (region === REGIONS.US) {
      return `${regionInfo.currencySymbol}${formattedPrice}`;
    } else if (region === REGIONS.EU) {
      return `${formattedPrice} ${regionInfo.currencySymbol}`;
    } else {
      return `${formattedPrice} ${regionInfo.currencySymbol}`;
    }
  } catch (error) {
    // Fallback formatting
    if (region === REGIONS.US) {
      return `$${price.toFixed(2)}`;
    } else if (region === REGIONS.EU) {
      return `${price.toFixed(2)} €`;
    } else {
      return `${price} ${regionInfo.currencySymbol}`;
    }
  }
}

/**
 * Format price range for multiple cocktails
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  region: Region
): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, region);
  }
  
  return `${formatPrice(minPrice, region)} - ${formatPrice(maxPrice, region)}`;
}

/**
 * Get currency symbol for a region
 */
export function getCurrencySymbol(region: Region): string {
  return REGION_INFO[region]?.currencySymbol || '$';
}

/**
 * Get tax rate for a region
 */
export function getTaxRate(region: Region): number {
  return REGION_INFO[region]?.taxRate || 0;
}

/**
 * Check if a cocktail is available in a specific region
 */
export function isAvailableInRegion(
  cocktail: { availability: RegionalAvailability },
  region: Region
): boolean {
  return cocktail.availability[region] || false;
}

/**
 * Filter cocktails by regional availability
 */
export function filterByRegionalAvailability<T extends { availability: RegionalAvailability }>(
  cocktails: T[],
  region: Region
): T[] {
  return cocktails.filter(cocktail => isAvailableInRegion(cocktail, region));
}

/**
 * Sort cocktails by price in a specific region
 */
export function sortByRegionalPrice<T extends { pricing: RegionalPricing }>(
  cocktails: T[],
  region: Region,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...cocktails].sort((a, b) => {
    const priceA = a.pricing[region]?.price || 0;
    const priceB = b.pricing[region]?.price || 0;
    
    if (order === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });
}

/**
 * Get price statistics for a region
 */
export function getRegionalPriceStats<T extends { pricing: RegionalPricing }>(
  cocktails: T[],
  region: Region
): {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  totalItems: number;
} {
  const prices = cocktails
    .map(cocktail => cocktail.pricing[region]?.price)
    .filter(price => price !== undefined) as number[];

  if (prices.length === 0) {
    return { minPrice: 0, maxPrice: 0, averagePrice: 0, totalItems: 0 };
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  return {
    minPrice,
    maxPrice,
    averagePrice,
    totalItems: prices.length
  };
} 