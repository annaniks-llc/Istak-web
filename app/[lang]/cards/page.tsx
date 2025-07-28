"use client";
import styles from "./Cards.module.scss";
import { useDictionary } from '@/dictionary-provider';
import type { Metadata } from 'next';

export const generateMetadata = (): Metadata => ({
  title: 'Cards',
  description: 'Browse our cards',
});

export default function CardsPage() {
  const dictionary = useDictionary();
  return (
    <div className={styles.cardsPage}>
      <h1>{dictionary.cards.heading}</h1>
      <ul>
        <li>Card 1</li>
        <li>Card 2</li>
        <li>Card 3</li>
      </ul>
    </div>
  );
} 