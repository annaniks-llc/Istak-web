'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrdersStore, Order } from '@/app/zustand/store/orders';
import { useAuthStore } from '@/app/zustand/store/auth';
import styles from './order-confirmation.module.scss';
import { useDictionary } from '@/dictionary-provider';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrderById } = useOrdersStore();
  const { user, isAuthenticated } = useAuthStore();
  const dictionary = useDictionary();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow both authenticated users and guest users to view order confirmation
    const foundOrder = getOrderById(orderId);
    if (foundOrder) {
      // For authenticated users, check if it's their order
      if (isAuthenticated && user && foundOrder.userId === user.id) {
        setOrder(foundOrder);
      } 
      // For guest users, allow access to any order by ID (since they don't have user ID)
      else if (!isAuthenticated) {
        setOrder(foundOrder);
      }
      // For authenticated users viewing someone else's order, don't show it
      else if (isAuthenticated && user && foundOrder.userId !== user.id) {
        router.push('/dashboard');
        return;
      }
    } else {
      // Order not found
      router.push('/');
    }
    setIsLoading(false);
  }, [orderId, getOrderById, user, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{dictionary.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>Order Not Found</h1>
          <p>The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'confirmed':
        return styles.confirmed;
      case 'shipped':
        return styles.shipped;
      case 'delivered':
        return styles.delivered;
      case 'cancelled':
        return styles.cancelled;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.successIcon}>✅</div>
        <h1>{dictionary.orderConfirmation.success}</h1>
        <p>Thank you for your order. We&apos;ll send you updates as your order progresses.</p>
        
        {!isAuthenticated && (
          <div className={styles.guestNote}>
            <p>💡 This is a guest order. Please save your Order ID ({order.id}) for future reference.</p>
          </div>
        )}
      </div>

      <div className={styles.orderDetails}>
        <div className={styles.orderInfo}>
          <h2>Order Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Order ID:</span>
              <span className={styles.value}>{order.id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Order Date:</span>
              <span className={styles.value}>{formatDate(order.createdAt)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            {order.trackingNumber && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Tracking Number:</span>
                <span className={styles.value}>{order.trackingNumber}</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Estimated Delivery:</span>
                <span className={styles.value}>{formatDate(order.estimatedDelivery)}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.shippingInfo}>
          <h2>Shipping Address</h2>
          <div className={styles.address}>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className={styles.paymentInfo}>
          <h2>Payment Information</h2>
          <div className={styles.paymentMethod}>
            <span className={styles.label}>Payment Method:</span>
            <span className={styles.value}>
              {order.paymentMethod === 'credit_card' && 'Credit Card'}
              {order.paymentMethod === 'paypal' && 'PayPal'}
              {order.paymentMethod === 'cash_on_delivery' && 'Cash on Delivery'}
            </span>
          </div>
        </div>

        <div className={styles.orderItems}>
          <h2>Order Items</h2>
          <div className={styles.itemsList}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <span className={styles.itemVolume}>{item.volume}ml</span>
                </div>
                <div className={styles.itemQuantity}>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderTotal}>
          <h2>Order Total</h2>
          <div className={styles.totalAmount}>
            <span className={styles.label}>Total Amount:</span>
            <span className={styles.value}>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <h2>What&apos;s Next?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Order Confirmation</h3>
              <p>You&apos;ll receive an email confirmation with your order details.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Processing</h3>
              <p>We&apos;ll prepare your order and notify you when it ships.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Delivery</h3>
              <p>Your order will be delivered to your specified address.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => router.push('/dashboard')} className={styles.dashboardButton}>
          View My Orders
        </button>
        <button onClick={() => router.push('/products')} className={styles.continueButton}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
