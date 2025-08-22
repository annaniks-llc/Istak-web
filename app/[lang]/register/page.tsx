'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './register.module.scss';
import { useDictionary } from '@/dictionary-provider';
import Input from '../components/Input';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().min(1, 'Phone number is required'),
    dateOfBirth: z.date().min(new Date('1900-01-01'), 'Please enter a valid date').max(new Date(), 'Date cannot be in the future'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const dictionary = useDictionary();
  const { lang } = useParams();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedValues = watch();

  const validateForm = (data: RegisterFormData): string | null => {
    if (!data.email || data.email.trim() === '') {
      return 'Please enter your email address';
    }
    
    if (!data.firstName || data.firstName.trim() === '') {
      return 'Please enter your first name';
    }
    
    if (!data.lastName || data.lastName.trim() === '') {
      return 'Please enter your last name';
    }
    
    if (!data.phone || data.phone.trim() === '') {
      return 'Please enter your phone number';
    }
    
    if (!data.dateOfBirth) {
      return 'Please select your date of birth';
    }
    
    if (!data.password || data.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (!data.confirmPassword) {
      return 'Please confirm your password';
    }
    
    if (data.password !== data.confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Validate form before submission
      const validationError = validateForm(data);
      if (validationError) {
        toast.error(validationError);
        setIsLoading(false);
        return;
      }

      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      });

      if (result.success) {
        toast.success('Registration successful! Welcome to our store.');
        clearErrors(); // Clear any form errors
        reset(); // Reset form to initial state
        router.push(`/${lang}/dashboard`);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (value: string) => {
    setValue(field, value);
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || '';
    setPhoneNumber(phoneValue);
    setValue('phone', phoneValue);
    
    // Clear phone error when user starts typing
    if (phoneValue && errors.phone) {
      // Clear the error by setting a valid value
      setValue('phone', phoneValue);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDateOfBirth(date);
    if (date) {
      setValue('dateOfBirth', date);
      // Clear date error when user selects a date
      if (errors.dateOfBirth) {
        setValue('dateOfBirth', date);
      }
    } else {
      setValue('dateOfBirth', undefined as any);
    }
  };

  const handleFormReset = () => {
    reset();
    setPhoneNumber('');
    setDateOfBirth(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    clearErrors();
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'ՍՏԵՂԾԵԼ ՀԱՇԻՎ',
      href: `/${lang}/register`
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className={styles.formContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Ստեղծել հաշիվ</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data: RegisterFormData) => {
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

          <div className={styles.nameRow}>
            <div className={styles.formGroup}>
              <Input
                type="text"
                placeholder="Անուն"
                value={watchedValues.firstName || ''}
                onChange={handleInputChange('firstName')}
                variant="filled"
                size="large"
                error={errors.firstName?.message}
                name="firstName"
                id="firstName"
              />
            </div>

            <div className={styles.formGroup}>
              <Input
                type="text"
                placeholder="Ազգանուն"
                value={watchedValues.lastName || ''}
                onChange={handleInputChange('lastName')}
                variant="filled"
                size="large"
                error={errors.lastName?.message}
                name="lastName"
                id="lastName"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.phoneInputContainer}>
              <PhoneInput
                international
                defaultCountry="US"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Հեռախոսահամար"
                className={`${styles.phoneInput} ${errors.phone ? styles.error : ''}`}
              />
              {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.dateInputContainer}>
              <div className={styles.dateInputWrapper}>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={handleDateChange}
                  placeholderText="օր / ամիս / տարի"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  minDate={new Date('1900-01-01')}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  wrapperClassName={styles.datePickerWrapper}
                  popperClassName={styles.datePickerPopper}
                  customInput={
                    <div className={styles.customDateInput}>
                      <input
                        type="text"
                        placeholder="օր / ամիս / տարի"
                        value={dateOfBirth ? dateOfBirth.toLocaleDateString('en-GB') : ''}
                        readOnly
                        className={errors.dateOfBirth ? styles.error : ''}
                      />
                      <svg 
                        className={styles.calendarIcon} 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none"
                      >
                        <path d="M22.2069 6.07002C21.9179 4.91502 20.9949 4.03402 19.8529 3.82502C19.6869 3.79502 19.5159 3.77402 19.3479 3.74502V2.72302C19.3479 1.89402 18.6769 1.22302 17.8479 1.22302C17.0189 1.22302 16.3479 1.89402 16.3479 2.72302V3.34502C13.4759 3.06802 10.5229 3.06802 7.65094 3.34502V2.72302C7.65094 1.89402 6.97994 1.22302 6.15094 1.22302C5.32194 1.22302 4.65094 1.89402 4.65094 2.72302V3.74402C4.48394 3.77202 4.31194 3.79302 4.14594 3.82402C3.00494 4.03202 2.08094 4.91302 1.79194 6.06802C1.66694 6.57002 1.55594 7.08602 1.46094 7.61302H22.5389C22.4429 7.08602 22.3329 6.57002 22.2079 6.06902L22.2069 6.07002Z" fill="#898989"/>
                        <path d="M22.8262 9.61499H1.17419C0.806195 13.033 1.01119 16.714 1.79319 19.838C2.08219 20.993 3.00619 21.874 4.14719 22.082C6.67919 22.544 9.34019 22.776 12.0012 22.776C14.6622 22.776 17.3222 22.545 19.8552 22.082C20.9962 21.874 21.9202 20.993 22.2092 19.838C22.9902 16.714 23.1962 13.034 22.8282 9.61499H22.8262ZM7.69119 17.959C7.13919 17.959 6.69119 17.511 6.69119 16.959C6.69119 16.407 7.13919 15.959 7.69119 15.959C8.24319 15.959 8.69119 16.407 8.69119 16.959C8.69119 17.511 8.24319 17.959 7.69119 17.959ZM7.69119 14.225C7.13919 14.225 6.69119 13.777 6.69119 13.225C6.69119 12.673 7.13919 12.225 7.69119 12.225C8.24319 12.225 8.69119 12.673 8.69119 13.225C8.69119 13.777 8.24319 14.225 7.69119 14.225ZM12.0052 17.951C11.4532 17.951 11.0052 17.503 11.0052 16.951C11.0052 16.399 11.4532 15.951 12.0052 15.951C12.5572 15.951 13.0052 16.399 13.0052 16.951C13.0052 17.503 12.5572 17.951 12.0052 17.951ZM12.0052 14.217C11.4532 14.217 11.0052 13.769 11.0052 13.217C11.0052 12.665 11.4532 12.217 12.0052 12.217C12.5572 12.217 13.0052 12.665 13.0052 13.217C13.0052 13.769 12.5572 14.217 12.0052 14.217ZM16.3112 17.951C15.7592 17.951 15.3112 17.503 15.3112 16.951C15.3112 16.399 15.7592 15.951 16.3112 15.951C16.8632 15.951 17.3112 16.399 17.3112 16.951C17.3112 17.503 16.8632 17.951 16.3112 17.951ZM16.3112 14.217C15.7592 14.217 15.3112 13.769 15.3112 13.217C15.3112 12.665 15.7592 12.217 16.3112 12.217C16.8632 12.217 17.3112 12.665 17.3112 13.217C17.3112 13.769 16.8632 14.217 16.3112 14.217Z" fill="#898989"/>
                      </svg>
                    </div>
                  }
                />
              </div>
              {errors.dateOfBirth && <span className={styles.errorMessage}>{errors.dateOfBirth.message}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordInputContainer}>
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
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="12" 
                  viewBox="0 0 18 12" 
                  fill="none"
                >
                  <path 
                    fill-rule="evenodd" 
                    clip-rule="evenodd" 
                    d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 7.328 7.64182 8.4 9 8.4C10.3582 8.4 11.4545 7.328 11.4545 6C11.4545 4.672 10.3582 3.6 9 3.6Z" 
                    fill="#898989"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
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
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="12" 
                  viewBox="0 0 18 12" 
                  fill="none"
                >
                  <path 
                    fill-rule="evenodd" 
                    clip-rule="evenodd" 
                    d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 7.328 7.64182 8.4 9 8.4C10.3582 8.4 11.4545 7.328 11.4545 6C11.4545 4.672 10.3582 3.6 9 3.6Z" 
                    fill="#898989"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.submitButtonContainer}>
            <Button
              text={isLoading ? 'Loading...' : 'ՄՈՒՏՔ ԳՈՐԾԵԼ'}
              variant="default"
              onClick={handleSubmit((data: RegisterFormData) => {
                void onSubmit(data);
              })}
            />
           
          </div>
        </form>

        {/* Login Link */}
        <div className={styles.loginLink}>
          <p>
            Ունե՞ք հաշիվ{' '}
            <Link href={`/${lang}/login`} className={styles.loginLinkText}>
              Մուտք գործե՞լ
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
