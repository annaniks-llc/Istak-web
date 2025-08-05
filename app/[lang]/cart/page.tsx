'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/zustand/store/cart';
import { useAuthStore } from '@/app/zustand/store/auth';
import toast from 'react-hot-toast';
import styles from './cart.module.scss';
import { useDictionary } from '@/dictionary-provider';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const dictionary = useDictionary();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h1>{dictionary.cart.empty}</h1>
          <p>{dictionary.cart.emptySubtitle}</p>
          <button onClick={handleContinueShopping} className={styles.continueButton}>
            {dictionary.cart.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{dictionary.cart.title}</h1>
        <p>{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <div className={styles.itemDetails}>
                  <span className={styles.volume}>{item.volume}ml</span>
                  <span className={styles.price}>${item.price.toFixed(2)}</span>
                </div>
              </div>

                             <div className={styles.itemQuantity}>
                 <label>{dictionary.cart.item.quantity}:</label>
                 <div className={styles.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className={styles.quantityButton}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
              </div>

                             <div className={styles.itemTotal}>
                 <span className={styles.totalLabel}>{dictionary.cart.item.total}:</span>
                 <span className={styles.totalPrice}>
                   ${(item.price * item.quantity).toFixed(2)}
                 </span>
               </div>

               <button
                 onClick={() => handleRemoveItem(item.id)}
                 className={styles.removeButton}
               >
                 {dictionary.cart.item.remove}
               </button>
            </div>
          ))}
        </div>

                 <div className={styles.cartSummary}>
           <h2>{dictionary.cart.summary.title}</h2>
           
           <div className={styles.summaryDetails}>
             <div className={styles.summaryRow}>
               <span>Items ({getTotalItems()}):</span>
               <span>${getTotalPrice().toFixed(2)}</span>
             </div>
             <div className={styles.summaryRow}>
               <span>{dictionary.cart.summary.shipping}:</span>
               <span>Free</span>
             </div>
             <div className={styles.summaryRow}>
               <span>{dictionary.cart.summary.tax}:</span>
               <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
             </div>
             <div className={styles.summaryDivider}></div>
             <div className={`${styles.summaryRow} ${styles.totalRow}`}>
               <span>{dictionary.cart.summary.total}:</span>
               <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
             </div>
           </div>

                     <div className={styles.cartActions}>
             <button onClick={handleCheckout} className={styles.checkoutButton}>
               {dictionary.cart.summary.checkout}
             </button>
             <button onClick={handleContinueShopping} className={styles.continueButton}>
               {dictionary.cart.continueShopping}
             </button>
             <button onClick={handleClearCart} className={styles.clearButton}>
               {dictionary.cart.actions.clearCart}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
} 