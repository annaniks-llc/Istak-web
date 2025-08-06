'use client';
import React from 'react';
import styles from './products.module.scss';
import ProductCard from '../../../ProductCard';

function Products() {
  return (
    <div className={styles.container}>
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink.png" />
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink.png" />
      <ProductCard title="Wheat Malt" prise={300} volume={0.3} src="/img/png/drink.png" />
    </div>
  );
}

export default Products;
