'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './artcocktails.module.scss';
import Button from '../../../Button';

function ArtCocktails() {
  return (
    <div className={styles.container}>
      <motion.img
        className={styles.image}
        src="/img/png/artImg.png"
        alt="Art Cocktail"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.4 }}
      />

      <motion.div
        className={styles.learnMore}
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <h3 className={styles.title}>Կոկտեյլների արվեստը</h3>
        <p className={styles.description}>
        <span>ISTAK-ի</span>  հետ կարող եք փորձարկել համեր եվ ստեղծել յուրօրինակ կոկտեյլներ, որոնք կդարձնեն ցանկացած երեկո անմոռանալի </p>
        <Button text="Իմանալ ավելին" variant="primary" onClick={() => {}} />
      </motion.div>
    </div>
  );
}

export default ArtCocktails;
