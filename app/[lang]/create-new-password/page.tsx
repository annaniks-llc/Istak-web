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
import styles from './create-new-password.module.scss';

const createNewPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Գաղտնաբառը պետք է ունենա առնվազն 8 նիշ')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Գաղտնաբառը պետք է պարունակի մեծատառ, փոքրատառ և թիվ'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Գաղտնաբառերը չեն համընկնում",
  path: ["confirmPassword"],
});

type CreateNewPasswordFormData = z.infer<typeof createNewPasswordSchema>;

export default function CreateNewPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { lang } = useParams();

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm<CreateNewPasswordFormData>({
    resolver: zodResolver(createNewPasswordSchema),
  });

  const watchedValues = watch();

  const handleInputChange = (field: keyof CreateNewPasswordFormData) => (value: string) => {
    setValue(field, value);
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const onSubmit = async (data: CreateNewPasswordFormData) => {
    try {
      setIsLoading(true);
      clearErrors();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, this would be an API call to update the password
      console.log('New password created for user');
      
      toast.success('Գաղտնաբառը հաջողությամբ փոխվել է');
      
      // Clear form
      setValue('newPassword', '');
      setValue('confirmPassword', '');
      
      // Redirect to login page after successful password change
      setTimeout(() => {
        window.location.href = `/${lang}/login`;
      }, 1500);
      
    } catch (error) {
      console.error('Password change error:', error);
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
      label: 'CREATE NEW PASSWORD',
      href: `/${lang}/create-new-password`
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
            <h1>Նոր գաղտնաբառ</h1>
            <p>
              Գրեք ձեր նոր գաղտնաբառը և կրկնեք այն հաստատման համար
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.passwordInputContainer}>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Գաղտնաբառ"
                  value={watchedValues.newPassword || ''}
                  onChange={handleInputChange('newPassword')}
                  variant="filled"
                  size="large"
                  error={errors.newPassword?.message}
                  name="newPassword"
                  id="newPassword"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 6.672 7.64182 7.6 9 7.6C7.64182 7.6 6.54545 6.672 6.54545 6C6.54545 5.328 7.64182 4.4 9 4.4C10.3582 4.4 11.4545 5.328 11.4545 6C11.4545 6.672 10.3582 7.6 9 7.6Z" fill="#898989" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 6.672 7.64182 7.6 9 7.6C7.64182 7.6 6.54545 6.672 6.54545 6C6.54545 5.328 7.64182 4.4 9 4.4C10.3582 4.4 11.4545 5.328 11.4545 6C11.4545 6.672 10.3582 7.6 9 7.6Z" fill="#898989" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordInputContainer}>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Կրկնել գաղտնաբառը"
                  value={watchedValues.confirmPassword || ''}
                  onChange={handleInputChange('confirmPassword')}
                  variant="filled"
                  size="large"
                  error={errors.confirmPassword?.message}
                  name="confirmPassword"
                  id="confirmPassword"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 6.672 7.64182 7.6 9 7.6C7.64182 7.6 6.54545 6.672 6.54545 6C6.54545 5.328 7.64182 4.4 9 4.4C10.3582 4.4 11.4545 5.328 11.4545 6C11.4545 6.672 10.3582 7.6 9 7.6Z" fill="#898989" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 6.672 7.64182 7.6 9 7.6C7.64182 7.6 6.54545 6.672 6.54545 6C6.54545 5.328 7.64182 4.4 9 4.4C10.3582 4.4 11.4545 5.328 11.4545 6C11.4545 6.672 10.3582 7.6 9 7.6Z" fill="#898989" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.submitButton}>
              <Button
                text={isLoading ? 'ՍՏԵՂԾՈՒՄ...' : 'ՍՏԵՂԾԵԼ ՆՈՐ ԳԱՂՏՆԱԲԱՌ'}
                variant="default"
                onClick={handleSubmit((data: CreateNewPasswordFormData) => {
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