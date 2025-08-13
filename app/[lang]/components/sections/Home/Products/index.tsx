'use client';
import React from 'react';
import styles from './products.module.scss';
import ProductCard from '../../../ProductCard';
import { useParams, useRouter } from 'next/navigation';

function Products() {
  const router = useRouter();
  const { lang } = useParams();
  return (
    <div className={styles.container}>
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink.png" goTo={() => router.push(`/${lang}/products/1`)} />
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink2.png" goTo={() => router.push(`/${lang}/products/2`)} />
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink.png" goTo={() => router.push(`/${lang}/products/3`)} />
    </div>
  );
}

export default Products;
