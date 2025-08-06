'use client';
import styles from './button.module.scss';

export default function Button({
  text,
  variant,
  onClick,
}: {
  text: string;
  variant: 'primary' | 'secondary' | 'light' | 'default';
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.button} ${variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'light' ? styles.light : styles.default}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
