'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import styles from './register.module.scss';
import { useDictionary } from '@/dictionary-provider';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don&apos;t match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const dictionary = useDictionary();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      if (result.success) {
        toast.success('Registration successful! Welcome to our store.');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>{dictionary.auth.register.title}</h1>
          <p>{dictionary.auth.register.subtitle}</p>
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit((data: RegisterFormData) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            onSubmit(data);
          })}
          className={styles.form}
        >
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">{dictionary.auth.register.firstName}</label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                placeholder={dictionary.auth.register.firstName}
                className={errors.firstName ? styles.error : ''}
              />
              {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">{dictionary.auth.register.lastName}</label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                placeholder={dictionary.auth.register.lastName}
                className={errors.lastName ? styles.error : ''}
              />
              {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">{dictionary.auth.register.email}</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder={dictionary.auth.register.email}
              className={errors.email ? styles.error : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">{dictionary.auth.register.phone}</label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder={dictionary.auth.register.phone}
              className={errors.phone ? styles.error : ''}
            />
            {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">{dictionary.auth.register.password}</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder={dictionary.auth.register.password}
              className={errors.password ? styles.error : ''}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">{dictionary.auth.register.confirmPassword}</label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              placeholder={dictionary.auth.register.confirmPassword}
              className={errors.confirmPassword ? styles.error : ''}
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? dictionary.auth.register.loading : dictionary.auth.register.submit}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {dictionary.auth.register.hasAccount}{' '}
            <Link href="/login" className={styles.link}>
              {dictionary.auth.register.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
