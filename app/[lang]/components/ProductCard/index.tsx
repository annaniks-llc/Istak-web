'use client';
import React from 'react';
import styles from './productCard.module.scss';
import AddToCartButton from '../AddToCartButton';
import { useParams } from 'next/navigation';

interface IProductCard {
  src: string;
  title: string | { en: string; hy: string; ru: string };
  prise: number;
  volume: number;
  onAddToCart?: () => void;
  disabled?: boolean;
}

function ProductCard({ src, title, prise, volume, onAddToCart, disabled = false }: IProductCard) {
  const { lang } = useParams();
  const currentLang = lang as string;

  // Handle multilingual title
  const getLocalizedTitle = () => {
    if (typeof title === 'string') {
      return title;
    }
    return title[currentLang as keyof typeof title] || title.en;
  };

  return (
    <div className={styles.item}>
      <div className={styles.imageCont}>
        <img src={src} className={styles.image} alt={getLocalizedTitle()} />
        <div className={styles.addToCartOverlay}>
          <AddToCartButton 
            onClick={onAddToCart}
            disabled={disabled}
            className={styles.addToCartButton}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.title}>{getLocalizedTitle()}</span>
        <div className={styles.productInfo}>
          <span className={styles.volume}>
            {prise} դր {volume} լ
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
