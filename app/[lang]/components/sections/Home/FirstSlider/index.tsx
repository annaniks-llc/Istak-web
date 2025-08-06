'use client';
import React, { useRef } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import styles from './firstSlider.module.scss';
import Button from '../../../Button';

function FirstSlider() {
  const sliderRef = useRef<Slider>(null);
  const next = () => sliderRef.current?.slickNext();
  const previous = () => sliderRef.current?.slickPrev();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className={styles.containerForFirstSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.sliderContainer}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <Slider ref={sliderRef} {...settings}>
            <div key={1} className={styles.sliderItem}>
              <h3 className={styles.heading}>ISTAK - Ավանդույթի ուժով</h3>
              <p className={styles.title}>Հայկական վարպետությամբ ստեղծված բարձրորակ օղի և ալկոհոլային խմիչքներ</p>
              <div className={styles.buttonContainer}>
                <Button text="Գնել հիմա" variant="secondary" onClick={() => {}} />
              </div>
            </div>
            {/* Optional: Other slides */}
          </Slider>
        </motion.div>

        <motion.div
          className={styles.sliderButtons}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <button className={styles.sliderButton} onClick={previous}>
            <img src="/img/svg/arrowleft.svg" alt="arrowleft" />
          </button>
          <button className={styles.sliderButton} onClick={next}>
            <img src="/img/svg/arrowRight.svg" alt="arrowRight" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default FirstSlider;
