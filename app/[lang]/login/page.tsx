'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import styles from './login.module.scss';
import { useDictionary } from '@/dictionary-provider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const dictionary = useDictionary();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>{dictionary.auth.login.title}</h1>
          <p>{dictionary.auth.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">{dictionary.auth.login.email}</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder={dictionary.auth.login.email}
              className={errors.email ? styles.error : ''}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">{dictionary.auth.login.password}</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder={dictionary.auth.login.password}
              className={errors.password ? styles.error : ''}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? dictionary.auth.login.loading : dictionary.auth.login.submit}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {dictionary.auth.login.noAccount}{' '}
            <Link href="/register" className={styles.link}>
              {dictionary.auth.login.signUp}
            </Link>
          </p>
        </div>

        <div className={styles.demo}>
          <p>Demo credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  );
} 