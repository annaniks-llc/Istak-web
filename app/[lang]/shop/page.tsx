"use client";
import styles from "./Shop.module.scss";
import { useDictionary } from '@/dictionary-provider';
import type { Metadata } from 'next';

export const generateMetadata = (): Metadata => ({
  title: 'Shop',
  description: 'Browse our products',
});

export default function ShopPage() {
  const dictionary = useDictionary();
  return (
    <div className={styles.shopPage}>
      <h1>{dictionary.shop.heading}</h1>
      <ul>
        <li>Product 1</li>
        <li>Product 2</li>
        <li>Product 3</li>
      </ul>
    </div>
  );
} 