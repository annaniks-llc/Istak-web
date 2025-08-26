'use client';
import React from 'react';
import styles from './products.module.scss';
import ProductCard from '../../../ProductCard';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function Products() {
  const router = useRouter();
  const { lang } = useParams();

  const cards = [
    { id: 1, title: "Wheat Malt", prise: 300, volume: 0.3, src: "/img/png/drink.png" },
    { id: 2, title: "Wheat Malt", prise: 300, volume: 0.3, src: "/img/png/drink2.png" },
    { id: 3, title: "Wheat Malt", prise: 300, volume: 0.3, src: "/img/png/drink.png" },
  ];

  return (
    <div className={styles.container}>
      {/* Animated Title */}
      <motion.p
        className={styles.title}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        Հատուկ առաջարկ
      </motion.p>

      <div className={styles.productsBox}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <ProductCard
              title={card.title}
              prise={card.prise}
              volume={card.volume}
              src={card.src}
              goTo={() => router.push(`/${lang}/products/${card.id}`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Products;
