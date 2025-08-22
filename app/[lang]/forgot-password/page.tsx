'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './forgot-password.module.scss';
import { useRouter } from 'next/navigation';

const forgotPasswordSchema = z.object({
  email: z.string().email('Խնդրում ենք մուտքագրել վավեր էլ. փոստի հասցե'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const watchedValues = watch();

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
    setValue(field, value);
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      clearErrors();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would be an API call to send reset email
      console.log('Password reset requested for:', data.email);
      
      toast.success('Գաղտնաբառի վերականգնման հղում ուղարկվել է ձեր էլ. փոստին');
      
      // Clear form
      setValue('email', '');
      
      // Redirect to create new password page with demo token and email
      // In a real app, this would be a link sent via email
      setTimeout(() => {
        const demoToken = 'reset_token_' + Math.random().toString(36).substr(2, 9);
        const encodedEmail = encodeURIComponent(data.email);
        router.push(`/${lang}/create-new-password?token=${demoToken}&email=${encodedEmail}`);
      }, 1500);
      
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին');
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'FORGOT PASSWORD',
      href: `/${lang}/forgot-password`
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1>Վերականգնել գաղտնաբառը</h1>
            <p>
              Պարզապես մուտքագրեք ձեր էլ. հասցեն, և մենք ձեզ կուղարկենք գաղտնաբառի վերականգնման հղում:
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <Input
                type="email"
                placeholder="էլ. փոստ"
                value={watchedValues.email || ''}
                onChange={handleInputChange('email')}
                error={errors.email?.message}
                disabled={isLoading}
                name="email"
                id="email"
              />
            </div>

            <div className={styles.submitButton}>
              <Button
                text={isLoading ? 'ՈՒՂԱՐԿՈՒՄ...' : 'ՄՈՒՏՔ ԳՈՐԾԵԼ'}
                variant="default"
                onClick={handleSubmit((data: ForgotPasswordFormData) => {
                  void onSubmit(data);
                })}
              />
            </div>

            <div className={styles.loginLink}>
              <span>Ունե՞ք հաշիվ</span>
              <a href={`/${lang}/login`}>Մուտք գործե՞լ</a>
            </div>
          </form>

          <div className={styles.disclaimer}>
            <p>
              Protected by reCAPTCHA and subject to the{' '}
              <a href="/privacy-policy">Privacy Policy</a> and{' '}
              <a href="/terms-of-service">Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 