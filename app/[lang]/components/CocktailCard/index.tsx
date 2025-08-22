import React from 'react';
import styles from './cocktailCard.module.scss';

interface CocktailCardProps {
  image: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({
  image,
  title,
  subtitle,
  onClick
}) => {
  return (
    <div className={styles.cocktailCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.cocktailImage} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export default CocktailCard;
