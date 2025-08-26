'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/dictionary-provider';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import CocktailCard from '../../components/CocktailCard';
import styles from './cocktail-detail.module.scss';

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
}

export default function CocktailDetailPage() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [otherCocktails, setOtherCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, id } = useParams();
  const dictionary = useDictionary();
  console.log(otherCocktails,'coctails')

  useEffect(() => {
    const fetchCocktail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cocktails/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCocktail(data);
      } catch (error) {
        console.log('API failed, using local data:', error);
        // Fallback to local data if API fails
        try {
          const localData = await import('@/app/data/cocktails.json');
          const foundCocktail = localData.default.find((c: Cocktail) => c.id === parseInt(id as string));
          setCocktail(foundCocktail || null);
        } catch (localError) {
          console.error('Failed to load local data:', localError);
          setCocktail(null);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchOtherCocktails = async () => {
      try {
        const response = await fetch('/api/cocktails');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter out current cocktail and get 5 others
        const filtered = data.filter((c: Cocktail) => c.id !== parseInt(id as string)).slice(0, 5);
        setOtherCocktails(filtered);
      } catch (error) {
        console.log('API failed, using local data for other cocktails:', error);
        try {
          const localData = await import('@/app/data/cocktails.json');
          const filtered = localData.default.filter((c: Cocktail) => c.id !== parseInt(id as string)).slice(0, 5);
          setOtherCocktails(filtered);
        } catch (localError) {
          console.error('Failed to load local data for other cocktails:', localError);
          setOtherCocktails([]);
        }
      }
    };

    if (id) {
      void fetchCocktail();
      void fetchOtherCocktails();
    }
  }, [id]);

  const getLocalizedText = (obj: { en: string; hy: string; ru: string }) => {
    return obj[lang as keyof typeof obj] || obj.en;
  };

  const getLocalizedArray = (arr: { en: string[]; hy: string[]; ru: string[] }) => {
    return arr[lang as keyof typeof arr] || arr.en;
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'ԿՈԿՏԵՅԼՆԵՐ',
      href: `/${lang}/cocktails`
    },
    {
      label: cocktail ? getLocalizedText(cocktail.name) : '...',
      href: `/${lang}/cocktails/${id}`
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Բեռնվում է...</p>
        </div>
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Կոկտեյլ չի գտնվել</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Recipe Section */}
      <div className={styles.recipeSection}>
        <div className={styles.recipeContent}>
          {/* Left Column - Image */}
          <div className={styles.imageColumn}>
            <div className={styles.cocktailImage}>
              <img src={cocktail.image} alt={getLocalizedText(cocktail.name)} />
            </div>
          </div>

          {/* Right Column - Recipe Details */}
          <div className={styles.recipeColumn}>
            <h1 className={styles.cocktailTitle}>{getLocalizedText(cocktail.name)}</h1>

            {/* Ingredients Section */}
            <div className={styles.recipeSection}>
              <h3>Բաղադրությունը</h3>
              <div className={styles.ingredientsList}>
                {getLocalizedArray(cocktail.ingredients).map((ingredient, index) => (
                  <div key={index}>{ingredient}</div>
                ))}
              </div>
            </div>

            {/* Preparation Method */}
            <div className={styles.recipeSection}>
              <h3>Պատրաստման եղանակ</h3>
              <p>{getLocalizedText(cocktail.instructions)}</p>
            </div>

            {/* Garnish */}
            <div className={styles.recipeSection}>
              <h3>Զարդարանք</h3>
              <p>Վերցրեք նարնջի (կամ կիտրոնի) բարակ կտոր և շփեք բաժակի եզրին: Բաժակի եզրը թաթախեք մանրացված սպիտակ շաքարի մեջ, որպեսզի շաքարը կպչի: Վերջում նարնջի կամ կիտրոնի կեղևը ոլորելով տեղադրեք բաժակի ներսում՝ նրբագեղ տեսքի համար:</p>
            </div>

            {/* Watch Preparation Button */}
            <div className={styles.watchButtonContainer}>
              <button className={styles.watchButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white" />
                </svg>
                ԴԻՏԵԼ ՊԱՏՐԱՍՏՈՒՄԸ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Cocktails Section */}
      <div className={styles.otherCocktailsSection}>
        <h2>ԱՅԼ ԿՈԿՏԵՅԼՆԵՐ</h2>
        <div className={styles.otherCocktailsGrid}>
          {otherCocktails.map((otherCocktail) => (
            <Link key={otherCocktail.id} href={`/${lang}/cocktails/${otherCocktail.id}`}>
              <CocktailCard
                image={otherCocktail.image}
                title={getLocalizedText(otherCocktail.name)}
                subtitle="With Istak Vodka"
                onClick={() => { }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 