import styles from "./Product.module.scss";
import { useDictionary } from '@/dictionary-provider';
import type { Metadata } from 'next';
import { useParams } from 'next/navigation';

export const generateMetadata = ({ params }: { params: { slug: string } }): Metadata => ({
  title: `Product: ${params.slug}`,
  description: `Details for product ${params.slug}`,
});

export default function ProductPage() {
  const dictionary = useDictionary();
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className={styles.productPage}>
      <h1>{dictionary.shop.productTitle}: {slug}</h1>
      <p>{dictionary.shop.productDescription}</p>
    </div>
  );
} 