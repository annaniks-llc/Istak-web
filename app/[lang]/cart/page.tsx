'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/dictionary-provider';
import { useCartStore } from '@/app/zustand/store/cart';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import styles from './cart.module.scss';

export default function CartPage() {
  const { lang } = useParams();
  const dictionary = useDictionary();
  const [couponCode, setCouponCode] = useState('');
  
  // Use Zustand cart store instead of local state
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getTotalPrice,
    addItem 
  } = useCartStore();

  // Debug: Log cart state changes
  React.useEffect(() => {
    console.log('Cart page - Cart items changed:', cartItems);
    console.log('Cart page - Total items:', cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  // Debug: Function to add test items
  const addTestItems = () => {
    console.log('Cart page - Adding test items');
    addItem({
      id: 'test-1',
      name: 'Test Product 1',
      price: 1000,
      volume: 0.5,
      image: '/img/png/drink.png',
    });
    addItem({
      id: 'test-2',
      name: 'Test Product 2',
      price: 2000,
      volume: 0.7,
      image: '/img/png/drink.png',
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.06); // 6% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = `/${lang}/checkout`;
  };

  const breadcrumbItems = [
    {
      label: 'HOME',
      href: `/${lang}`
    },
    {
      label: 'SHOP',
      href: `/${lang}/products`
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className={styles.emptyCart}>
          <h2>Ձեր զամբյուղը դատարկ է</h2>
          <p>Խնդրում ենք ավելացնել ապրանքներ ձեր զամբյուղում</p>
          <Button
            text="Գնալ խանութ"
            variant="default"
            onClick={() => window.location.href = `/${lang}/products`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className={styles.cartContent}>
        {/* Left Section - Shopping Cart */}
        <div className={styles.cartSection}>
          <h1 className={styles.sectionTitle}>ԶԱՄԲՅՈՒՂ</h1>

          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/img/png/drink.png';
                    }}
                  />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>{item.price} դր / {item.volume}լ</p>
                </div>

                <div className={styles.quantitySelector}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  {item.price * item.quantity} դր
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Հեռացնել
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className={styles.orderSummarySection}>
          <h2 className={styles.sectionTitle}>Պատվերի ամփոփում</h2>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Պատվեր</span>
              <span>{calculateSubtotal()} դր</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Առաքում</span>
              <span className={styles.freeDelivery}>Անվճար</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Հարկեր</span>
              <span>{calculateTax()} դր</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>Ընդամենը</span>
            <span>{calculateTotal()} դր</span>
          </div>

          <div className={styles.couponSection}>
            <div className={styles.couponInput}>
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className={styles.applyCouponBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41V13.41Z" stroke="#231F20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7 7H7.01" stroke="#231F20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.cartActions}>
            <Button
              text="Ավելացնել թեստ ապրանքներ"
              variant="light"
              onClick={addTestItems}
            />
            <Button
              text="Մաքրել զամբյուղը"
              variant="light"
              onClick={clearCart}
            />
          </div>

          <div className={styles.checkoutButton}>
            <Button
              text="ՎՃԱՐԵԼ"
              variant="default"
              onClick={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
