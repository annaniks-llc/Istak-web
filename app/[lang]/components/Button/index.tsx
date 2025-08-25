'use client';
import styles from './button.module.scss';

export default function Button({
  text,
  variant,
  type,
  onClick,
}: {
  text: string;
  variant: 'primary' | 'secondary' | 'light' | 'default';
  type?: "button" | "submit" | "reset" | undefined;
  onClick: () => void;
}) {
  return (
    <button
      type={ type?type:"button"}
      className={`${styles.button} ${variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : variant === 'light' ? styles.light : styles.default}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
