'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/app/zustand/store/cart';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useOrdersStore } from '@/app/zustand/store/orders';
import Breadcrumb from '../components/Breadcrumb';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './checkout.module.scss';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'Անունը պարտադիր է'),
  lastName: z.string().min(1, 'Ազգանունը պարտադիր է'),
  email: z.string().email('Խնդրում ենք մուտքագրել վավեր էլ. փոստի հասցե'),
  phone: z.string().min(1, 'Հեռախոսահամարը պարտադիր է'),
  country: z.string().min(1, 'Երկիրը պարտադիր է'),
  city: z.string().min(1, 'Քաղաքը պարտադիր է'),
  address: z.string().min(1, 'Հասցեն պարտադիր է'),
  paymentMethod: z.enum(['banking_card']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useParams();
  
  // Get cart data from store
  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();
  
  // Get user data from auth store
  const { user, isAuthenticated } = useAuthStore();
  
  // Get orders store
  const { createOrder } = useOrdersStore();

  // Calculate order totals from actual cart data
  const orderData = React.useMemo(() => {
    const subtotal = getTotalPrice();
    const delivery = 0; // Free delivery
    const tax = Math.round(subtotal * 0.06); // 6% tax
    const total = subtotal + delivery + tax;
    
    return { subtotal, delivery, tax, total };
  }, [getTotalPrice]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'banking_card'
    }
  });

  const watchedValues = watch();

  // Pre-fill form with user data if available (only for authenticated users)
  useEffect(() => {
    if (user && isAuthenticated) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, isAuthenticated, setValue]);

  // Debug: Log cart and user data
  useEffect(() => {
    console.log('Checkout page - Cart items:', cartItems);
    console.log('Checkout page - User data:', user);
    console.log('Checkout page - Is authenticated:', isAuthenticated);
    console.log('Checkout page - Order totals:', orderData);
  }, [cartItems, user, isAuthenticated, orderData]);

  // Debug: Log order creation
  const handleOrderCreation = async (data: CheckoutFormData) => {
    console.log('Checkout page - Creating order with data:', data);
    console.log('Checkout page - Cart items for order:', cartItems);
    console.log('Checkout page - User ID for order:', user?.id);
    
    return await onSubmit(data);
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'SHOP',
      href: `/${lang}/products`
    },
    {
      label: 'ՊԱՏՎԵՐԻ ԷՋ',
      href: `/${lang}/checkout`
    },
    {
      label: 'BARLEY MALT',
      href: `/${lang}/products`
    }
  ];

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Ձեր զամբյուղը դատարկ է');
      setTimeout(() => {
        window.location.href = `/${lang}/cart`;
      }, 1500);
    }
  }, [cartItems.length, lang]);

  // Don't render checkout if cart is empty
  if (cartItems.length === 0) {
    return null; // Just return null instead of custom UI
  }

  // Allow guest checkout - no authentication required
  // Users can checkout without logging in

  const handleInputChange = (field: keyof CheckoutFormData) => (value: string) => {
    setValue(field, value);
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);
      clearErrors();

      // Handle guest checkout - create guest user ID if not authenticated
      const userId = isAuthenticated && user ? user.id : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Checkout page - User type:', isAuthenticated ? 'Authenticated' : 'Guest');
      console.log('Checkout page - User ID for order:', userId);

      // Create the order using the orders store
      const orderResult = await createOrder({
        userId: userId,
        items: cartItems,
        shippingAddress: {
          street: data.address,
          city: data.city,
          state: data.country, // Using country as state for now
          zipCode: '0000', // Default zip code since not in form
          country: data.country,
        },
        paymentMethod: data.paymentMethod === 'banking_card' ? 'credit_card' : 'credit_card',
      });

      if (orderResult.success) {
        // Clear the cart after successful order
        clearCart();
        
        toast.success('Պատվերը հաջողությամբ կատարվել է');

        // For guest users, redirect to a simple confirmation page
        // For logged-in users, redirect to dashboard
        if (isAuthenticated && user) {
          setTimeout(() => {
            window.location.href = `/${lang}/dashboard?tab=orders`;
          }, 1500);
        } else {
          // Guest user - show order confirmation
          setTimeout(() => {
            window.location.href = `/${lang}/order-confirmation/${orderResult.orderId}`;
          }, 1500);
        }
      } else {
        toast.error(orderResult.error || 'Պատվերի կատարումը ձախողվեց');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.checkoutContent}>
        {/* Left Section - Delivery Information */}
        <div className={styles.deliverySection}>
          <h1 className={styles.sectionTitle}>ԱՌԱՔՄԱՆ ԻՆՈՐՄԱՑԻԱ</h1>
          
          {/* {!isAuthenticated && (
            <div className={styles.guestNote}>
              <p>💡 Դուք կարող եք պատվեր կատարել առանց գրանցման</p>
            </div>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)} className={styles.deliveryForm}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  placeholder="First name"
                  value={watchedValues.firstName || ''}
                  onChange={handleInputChange('firstName')}
                  variant="filled"
                  size="large"
                  error={errors.firstName?.message}
                  name="firstName"
                  id="firstName"
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  placeholder="Last name"
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

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={watchedValues.email || ''}
                  onChange={handleInputChange('email')}
                  variant="filled"
                  size="large"
                  error={errors.email?.message}
                  name="email"
                  id="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={watchedValues.phone || ''}
                  onChange={handleInputChange('phone')}
                  variant="filled"
                  size="large"
                  error={errors.phone?.message}
                  name="phone"
                  id="phone"
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  placeholder="Country"
                  value={watchedValues.country || ''}
                  onChange={handleInputChange('country')}
                  variant="filled"
                  size="large"
                  error={errors.country?.message}
                  name="country"
                  id="country"
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  placeholder="Town / City"
                  value={watchedValues.city || ''}
                  onChange={handleInputChange('city')}
                  variant="filled"
                  size="large"
                  error={errors.city?.message}
                  name="city"
                  id="city"
                />
              </div>
            </div>

            <div className={`${styles.formRow} ${styles.fullWidth}`}>
              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  placeholder="Address"
                  value={watchedValues.address || ''}
                  onChange={handleInputChange('address')}
                  variant="filled"
                  size="large"
                  error={errors.address?.message}
                  name="address"
                  id="address"
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.paymentAndSubmit}>
              <div className={styles.paymentMethod}>
                <label className={styles.paymentLabel}>
                  <input
                    type="radio"
                    value="banking_card"
                    {...register('paymentMethod')}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentText}>BANKING CART</span>
                  <div className={styles.visaLogo}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="24" viewBox="0 0 37 24" fill="none">
                      <g clip-path="url(#clip0_406_1756)">
                        <path d="M2.1763 0.235291H35.1175C36.1571 0.235291 36.9998 1.07807 36.9998 2.11764V21.8824C36.9998 22.922 36.1571 23.7647 35.1175 23.7647H2.1763C1.13672 23.7647 0.293945 22.922 0.293945 21.8824V2.11764C0.293945 1.07807 1.13672 0.235291 2.1763 0.235291Z" fill="#0E4595" />
                        <path d="M14.0913 16.6461L15.6612 7.43387H18.1723L16.6012 16.6461H14.0913ZM25.6729 7.63246C25.1755 7.44583 24.3959 7.24554 23.4225 7.24554C20.9413 7.24554 19.1935 8.49496 19.1787 10.2857C19.1646 11.6095 20.4264 12.3479 21.3788 12.7886C22.3563 13.2401 22.6848 13.528 22.6802 13.9313C22.674 14.5487 21.8997 14.8309 21.178 14.8309C20.1729 14.8309 19.639 14.6912 18.8143 14.3473L18.4908 14.2009L18.1383 16.2632C18.7248 16.5203 19.8094 16.7431 20.9354 16.7546C23.5749 16.7546 25.2884 15.5195 25.3079 13.6072C25.3173 12.5593 24.6484 11.7618 23.1996 11.1043C22.322 10.6782 21.7845 10.3937 21.7902 9.96225C21.7902 9.57933 22.2452 9.16983 23.2282 9.16983C24.0493 9.15712 24.6442 9.33618 25.1076 9.52277L25.3326 9.62912L25.6729 7.63246ZM32.1346 7.43373H30.1942C29.5932 7.43373 29.1433 7.59783 28.8794 8.19769L25.1502 16.64H27.787C27.787 16.64 28.2181 15.5048 28.3156 15.2557C28.6038 15.2557 31.1652 15.2596 31.5315 15.2596C31.6066 15.5821 31.8369 16.64 31.8369 16.64H34.1669L32.1346 7.43345V7.43373ZM29.0561 13.3824C29.2637 12.8517 30.0565 10.8072 30.0565 10.8072C30.0417 10.8318 30.2626 10.2739 30.3894 9.92799L30.5591 10.7223C30.5591 10.7223 31.04 12.9213 31.1404 13.3824H29.0561ZM11.9596 7.43373L9.50125 13.7161L9.23927 12.4394C8.78163 10.9677 7.35574 9.37326 5.76172 8.575L8.00953 16.6315L10.6663 16.6285L14.6194 7.43364H11.9596" fill="white" />
                        <path d="M7.20701 7.43342H3.15802L3.12598 7.62509C6.276 8.38763 8.36033 10.2304 9.22574 12.4444L8.34527 8.21097C8.19327 7.62767 7.75247 7.4536 7.20711 7.43323" fill="#F2AE14" />
                      </g>
                      <defs>
                        <clipPath id="clip0_406_1756">
                          <rect width="36.7059" height="24" fill="white" transform="translate(0.293945)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </label>
              </div>

              <div className={styles.submitButton}>
                <Button
                  text={isLoading ? 'ՎՃԱՐՈՒՄ...' : 'ՎՃԱՐԵԼ'}
                  variant="default"
                  onClick={handleSubmit((data: CheckoutFormData) => {
                    void onSubmit(data);
                  })}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Section - Order Summary */}
        <div className={styles.orderSummarySection}>
          <h2 className={styles.sectionTitle}>Պատվերի ամփոփում</h2>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Պատվեր</span>
              <span>{orderData.subtotal} դր</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Առաքում</span>
              <span className={styles.freeDelivery}>Անվճար</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Հարկեր</span>
              <span>{orderData.tax} դր</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>Ընդամենը</span>
            <span>{orderData.total} դր</span>
          </div>
        </div>
      </div>
    </div>
  );
}
