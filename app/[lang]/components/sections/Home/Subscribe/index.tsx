'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './subscribe.module.scss';
import Button from '../../../Button';
import Input from '../../../Input';

function Subscribe() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h3
        className={styles.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Բաժանորդագրվեք ISTAK-ի նորություններին
      </motion.h3>

      <motion.div
        className={styles.inputs}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={styles.inputContainer}>
          <Input placeholder="Անուն" />
        </div>
        <div className={styles.inputContainer}>
          <Input placeholder="Ազգանուն" />
        </div>
        <div className={styles.inputContainer}>
          <Input placeholder="Ծննդյան ամսաթիվ ՕՕ/ԱԱ/ՏՏՏՏ" />
        </div>
        <div className={styles.inputContainer}>
          <Input placeholder="Էլ․ հասցե*" />
        </div>
      </motion.div>

      <motion.p
        className={styles.description1}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Սեղմելով «Ուղարկել» կոճակը՝ համաձայնվում եմ ստանալ անձնականացված հաղորդագրություններ ISTAK-ից...
      </motion.p>

      <motion.p
        className={styles.description2}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Ցանկացած պահի կարող եք հրաժարվել բաժանորդագրությունից...
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Button text="Ուղարկել" variant="default" onClick={() => {}} />
      </motion.div>
    </motion.div>
  );
}

export default Subscribe;
