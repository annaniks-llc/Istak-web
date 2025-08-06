'use client';
import React from 'react';
import styles from './input.module.scss';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  error?: string;
  label?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value = '',
  onChange,
  variant = 'default',
  size = 'medium',
  disabled = false,
  required = false,
  className = '',
  name,
  id,
  error,
  label,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        className={inputClasses}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
