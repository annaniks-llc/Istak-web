'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/dictionary-provider';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';
import CocktailCard from '../components/CocktailCard';
import styles from './cocktails.module.scss';
import { 
  detectRegionFromLanguage, 
  getRegionalPricing, 
  formatPrice, 
  type Region,
  type CocktailPricing 
} from '@/app/utils/regionalPricing';

interface Cocktail {
  id: number;
  name: {
    en: string;
    hy: string;
    ru: string;
  };
  description: {
    en: string;
    hy: string;
    ru: string;
  };
  ingredients: {
    en: string[];
    hy: string[];
    ru: string[];
  };
  instructions: {
    en: string;
    hy: string;
    ru: string;
  };
  category: string;
  difficulty: string;
  prepTime: string;
  servings: number;
  alcoholContent: string;
  glassType: string;
  pricing: {
    AM: CocktailPricing;
    RU: CocktailPricing;
    US: CocktailPricing;
    EU: CocktailPricing;
  };
  rating: number;
  image: string;
  gallery: string[];
  tags: string[];
  nutritionalInfo: {
    calories: number;
    carbs: number;
    sugar: number;
    protein: number;
  };
  seasonal: string[];
  popular: boolean;
  featured: boolean;
  availability: {
    AM: boolean;
    RU: boolean;
    US: boolean;
    EU: boolean;
  };
}

export default function CocktailsPage() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [filteredCocktails, setFilteredCocktails] = useState<Cocktail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'price' | 'prepTime'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [userRegion, setUserRegion] = useState<Region>('AM'); // Default to Armenia
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const dictionary = useDictionary();

  useEffect(() => {
    // Detect user region based on language or geolocation
    const region = detectRegionFromLanguage(lang as string);
    setUserRegion(region);
  }, [lang]);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchCocktails = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cocktails');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API data received:', data);
        setCocktails(data);
        setFilteredCocktails(data);
      } catch (error) {
        console.log('API failed, using local data:', error);
        // Fallback to local data if API fails
        try {
          const localData = await import('@/app/data/cocktails.json');
          console.log('Local data loaded:', localData.default);
          setCocktails(localData.default);
          setFilteredCocktails(localData.default);
        } catch (localError) {
          console.error('Failed to load local data:', localError);
          setCocktails([]);
          setFilteredCocktails([]);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchCocktails();
  }, []);

  useEffect(() => {
    let filtered = [...cocktails];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cocktail => {
        const localizedName = cocktail.name[lang as keyof typeof cocktail.name] || cocktail.name.en;
        const localizedDescription = cocktail.description[lang as keyof typeof cocktail.description] || cocktail.description.en;
        return localizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               localizedDescription.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cocktail => cocktail.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(cocktail => cocktail.difficulty === selectedDifficulty);
    }

    // Filter by availability in user's region
    filtered = filtered.filter(cocktail => cocktail.availability && cocktail.availability[userRegion]);

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name[lang as keyof typeof a.name] || a.name.en;
          bValue = b.name[lang as keyof typeof b.name] || b.name.en;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'price':
          aValue = a.pricing && a.pricing[userRegion]?.price || 0;
          bValue = b.pricing && b.pricing[userRegion]?.price || 0;
          break;
        case 'prepTime':
          aValue = parseInt(a.prepTime);
          bValue = parseInt(b.prepTime);
          break;
        default:
          aValue = a.name.en;
          bValue = b.name.en;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCocktails(filtered);
  }, [cocktails, searchTerm, selectedCategory, selectedDifficulty, sortBy, sortOrder, lang, userRegion]);

  const getLocalizedText = (obj: { en: string; hy: string; ru: string }) => {
    return obj[lang as keyof typeof obj] || obj.en;
  };

  const getLocalizedArray = (arr: { en: string[]; hy: string[]; ru: string[] }) => {
    return arr[lang as keyof typeof arr] || arr.en;
  };

  const getRegionalPricingData = (cocktail: Cocktail) => {
    if (!cocktail || !cocktail.pricing) return null;
    
    const pricing = getRegionalPricing(cocktail, userRegion);
    if (!pricing) return null;
    
    const discountedPrice = pricing.price * (1 - pricing.discount);
    const priceWithTax = discountedPrice * (1 + pricing.taxRate);
    
    return {
      ...pricing,
      discountedPrice,
      priceWithTax
    };
  };

  const categories = ['all', 'rum', 'tequila', 'whiskey', 'gin', 'vodka'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'COCKTAILS',
      href: `/${lang}/cocktails`
    },
  ];

  // Get region info from the first available cocktail
  const getRegionInfo = () => {
    if (filteredCocktails.length > 0 && filteredCocktails[0]) {
      const pricing = getRegionalPricingData(filteredCocktails[0]);
      return {
        region: pricing?.region || 'Armenia',
        currency: pricing?.currency || 'AMD'
      };
    }
    return {
      region: 'Armenia',
      currency: 'AMD'
    };
  };

  const regionInfo = getRegionInfo();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Բեռնվում է...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <span>HOME</span>
            <span>/</span>
            <span>ԿՈԿՏԵՅԼՆԵՐ</span>
          </div>
          <h1>ԿՈԿՏԵՅԼՆԵՐ</h1>
        </div>
      </div>
      {/* Cocktails Grid */}
      <div className={styles.cocktailsGrid}>
        {filteredCocktails.slice(0, 5).map((cocktail) => (
          <Link key={cocktail.id} href={`/${lang}/cocktails/${cocktail.id}`}>
            <CocktailCard
              image={cocktail.image}
              title={getLocalizedText(cocktail.name)}
              subtitle="With Istak Vodka"
              onClick={() => {}}
            />
          </Link>
        ))}
      </div>

      {filteredCocktails.length === 0 && (
        <div className={styles.noResults}>
          <p>Կոկտեյլ չի գտնվել:</p>
          <p>Փորձեք փոխել ֆիլտրերը կամ որոնման տերմինը</p>
        </div>
      )}
    </div>
  );
} 