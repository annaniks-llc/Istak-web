'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/app/zustand/store/cart';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useOrdersStore } from '@/app/zustand/store/orders';
import toast from 'react-hot-toast';
import styles from './checkout.module.scss';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createOrder } = useOrdersStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Pre-fill form with user data if available
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
      if (user.address) {
        setValue('street', user.address.street);
        setValue('city', user.address.city);
        setValue('state', user.address.state);
        setValue('zipCode', user.address.zipCode);
      }
    }
  }, [isAuthenticated, items.length, user, router, setValue]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);

    try {
      const result = await createOrder({
        userId: user!.id,
        items,
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      });

      if (result.success) {
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/order-confirmation/${result.orderId}`);
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutForm}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit((data: CheckoutFormData) => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              onSubmit(data);
            })}
          >
            <div className={styles.section}>
              <h2>Shipping Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input {...register('firstName')} type="text" id="firstName" className={errors.firstName ? styles.error : ''} />
                  {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input {...register('lastName')} type="text" id="lastName" className={errors.lastName ? styles.error : ''} />
                  {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input {...register('email')} type="email" id="email" className={errors.email ? styles.error : ''} />
                  {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input {...register('phone')} type="tel" id="phone" className={errors.phone ? styles.error : ''} />
                  {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="street">Street Address</label>
                  <input {...register('street')} type="text" id="street" className={errors.street ? styles.error : ''} />
                  {errors.street && <span className={styles.errorMessage}>{errors.street.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <input {...register('city')} type="text" id="city" className={errors.city ? styles.error : ''} />
                  {errors.city && <span className={styles.errorMessage}>{errors.city.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="state">State</label>
                  <input {...register('state')} type="text" id="state" className={errors.state ? styles.error : ''} />
                  {errors.state && <span className={styles.errorMessage}>{errors.state.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="zipCode">Zip Code</label>
                  <input {...register('zipCode')} type="text" id="zipCode" className={errors.zipCode ? styles.error : ''} />
                  {errors.zipCode && <span className={styles.errorMessage}>{errors.zipCode.message}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <input {...register('country')} type="text" id="country" className={errors.country ? styles.error : ''} />
                  {errors.country && <span className={styles.errorMessage}>{errors.country.message}</span>}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Payment Method</h2>
              <div className={styles.paymentMethods}>
                <label className={styles.paymentOption}>
                  <input {...register('paymentMethod')} type="radio" value="credit_card" defaultChecked />
                  <span className={styles.radioLabel}>Credit Card</span>
                </label>

                <label className={styles.paymentOption}>
                  <input {...register('paymentMethod')} type="radio" value="paypal" />
                  <span className={styles.radioLabel}>PayPal</span>
                </label>

                <label className={styles.paymentOption}>
                  <input {...register('paymentMethod')} type="radio" value="cash_on_delivery" />
                  <span className={styles.radioLabel}>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>

          <div className={styles.orderItems}>
            {items.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
