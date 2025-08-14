'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import styles from './login.module.scss';
import { useDictionary } from '@/dictionary-provider';
import Input from '../components/Input';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const dictionary = useDictionary();
  const { lang } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        const errorMessage = 'message' in result ? String(result.message) : 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setValue(field, value);
    clearErrors(field);
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'LOGIN',
      href: `/${lang}/login`
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className={styles.formContainer}>
        {/* Breadcrumb */}
        {/* <div className={styles.breadcrumb}>
          <span>HOME</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>ՄՈՒՏՔ</span>
        </div> */}

        {/* Header */}
        <div className={styles.header}>
          <h1>Մուտք</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data: LoginFormData) => {
            void onSubmit(data);
          })}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <Input
              type="email"
              placeholder="էլ. փոստ"
              value={watchedValues.email || ''}
              onChange={handleInputChange('email')}
              variant="filled"
              size="large"
              error={errors.email?.message}
              name="email"
              id="email"
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Գաղտնաբառ"
              value={watchedValues.password || ''}
              onChange={handleInputChange('password')}
              variant="filled"
              size="large"
              error={errors.password?.message}
              name="password"
              id="password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 7.328 7.64182 8.4 9 8.4C10.3582 8.4 11.4545 7.328 11.4545 6C11.4545 4.672 10.3582 3.6 9 3.6Z" fill="#898989" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 7.328 7.64182 8.4 9 8.4C10.3582 8.4 11.4545 7.328 11.4545 6C11.4545 4.672 10.3582 3.6 9 3.6Z" fill="#898989" />
                </svg>}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/forgot-password" className={styles.forgotPasswordLink}>
              Մոռացե՞լ եք գաղտնաբառը
            </Link>
          </div>

          {/* Submit Button */}
          <div className={styles.submitButtonContainer}>
            <Button text={isLoading ? 'Loading...' : 'ՄՈՒՏՔ ԳՈՐԾԵԼ'} variant="default" onClick={handleSubmit((data: LoginFormData) => {
              void onSubmit(data);
            })} />
            {/* <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Loading...' : 'ՄՈՒՏՔ ԳՈՐԾԵԼ'}
            </button> */}
          </div>
        </form>

        {/* Registration Link */}
        <div className={styles.registration}>
          <p>
            Դեռ չունե՞ք հաշիվ{' '}
            <Link href="/register" className={styles.registrationLink}>
              Ստեղծել հաշիվ
            </Link>
          </p>
        </div>

        {/* reCAPTCHA Notice */}
        <div className={styles.recaptcha}>
          <p>
            Protected by reCAPTCHA and subject to the{' '}
            <Link href="/privacy" className={styles.recaptchaLink}>
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className={styles.recaptchaLink}>
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
