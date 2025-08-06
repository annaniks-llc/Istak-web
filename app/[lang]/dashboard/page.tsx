'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useOrdersStore } from '@/app/zustand/store/orders';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import styles from './dashboard.module.scss';
import { useDictionary } from '@/dictionary-provider';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { getUserOrders } = useOrdersStore();
  const dictionary = useDictionary();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      });
    }
  }, [isAuthenticated, user, router, reset]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      });

      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const userOrders = user ? getUserOrders(user.id) : [];

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{dictionary.dashboard.title}</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          {dictionary.navigation.logout}
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          {dictionary.dashboard.tabs.profile}
        </button>
        <button className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`} onClick={() => setActiveTab('orders')}>
          {dictionary.dashboard.tabs.orders} ({userOrders.length})
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'profile' && (
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2>{dictionary.dashboard.profile.title}</h2>
              <button onClick={() => setIsEditing(!isEditing)} className={styles.editButton}>
                {isEditing ? dictionary.common.cancel : dictionary.common.edit}
              </button>
            </div>

            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit((data: ProfileFormData) => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                onSubmit(data);
              })}
              className={styles.form}
            >
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>{dictionary.dashboard.profile.firstName}</label>
                  <input {...register('firstName')} disabled={!isEditing} className={errors.firstName ? styles.error : ''} />
                  {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>{dictionary.dashboard.profile.lastName}</label>
                  <input {...register('lastName')} disabled={!isEditing} className={errors.lastName ? styles.error : ''} />
                  {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{dictionary.dashboard.profile.email}</label>
                <input {...register('email')} type="email" disabled={!isEditing} className={errors.email ? styles.error : ''} />
                {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>{dictionary.dashboard.profile.phone}</label>
                <input {...register('phone')} type="tel" disabled={!isEditing} className={errors.phone ? styles.error : ''} />
                {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
              </div>

              <h3>{dictionary.dashboard.profile.address}</h3>

              <div className={styles.formGroup}>
                <label>{dictionary.dashboard.profile.street}</label>
                <input {...register('street')} disabled={!isEditing} className={errors.street ? styles.error : ''} />
                {errors.street && <span className={styles.errorMessage}>{errors.street.message}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>{dictionary.dashboard.profile.city}</label>
                  <input {...register('city')} disabled={!isEditing} className={errors.city ? styles.error : ''} />
                  {errors.city && <span className={styles.errorMessage}>{errors.city.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>{dictionary.dashboard.profile.state}</label>
                  <input {...register('state')} disabled={!isEditing} className={errors.state ? styles.error : ''} />
                  {errors.state && <span className={styles.errorMessage}>{errors.state.message}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{dictionary.dashboard.profile.zipCode}</label>
                <input {...register('zipCode')} disabled={!isEditing} className={errors.zipCode ? styles.error : ''} />
                {errors.zipCode && <span className={styles.errorMessage}>{errors.zipCode.message}</span>}
              </div>

              {isEditing && (
                <button type="submit" disabled={isLoading} className={styles.saveButton}>
                  {isLoading ? dictionary.dashboard.profile.saving : dictionary.dashboard.profile.save}
                </button>
              )}
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            <h2>{dictionary.dashboard.orders.title}</h2>
            {userOrders.length === 0 ? (
              <div className={styles.emptyOrders}>
                <p>{dictionary.dashboard.orders.noOrders}</p>
                <button onClick={() => router.push('/products')} className={styles.shopButton}>
                  {dictionary.navigation.products}
                </button>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {userOrders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <h3>Order #{order.id}</h3>
                      <span className={`${styles.status} ${styles[order.status]}`}>{order.status}</span>
                    </div>
                    <div className={styles.orderDetails}>
                      <p>Total: ${order.totalAmount.toFixed(2)}</p>
                      <p>Items: {order.items.length}</p>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
