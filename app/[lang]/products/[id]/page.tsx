'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/app/zustand/store/products';
import { useCartStore } from '@/app/zustand/store/cart';
import toast from 'react-hot-toast';
import styles from './product-details.module.scss';
import { useDictionary } from '@/dictionary-provider';

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { getProductById, getProductsByCategory, products } = useProductsStore();
  const { addItem } = useCartStore();
  const dictionary = useDictionary();

  const product = getProductById(productId);
  const relatedProducts = product
    ? getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    : [];

  useEffect(() => {
    if (!product && products.length > 0) {
      toast.error('Product not found');
      router.push('/products');
    }
  }, [product, products.length, router]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        volume: product.volume,
        image: product.image,
      });
    }

    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{dictionary.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <button onClick={() => router.push('/products')} className={styles.backButton}>
          ← {dictionary.common.back} {dictionary.navigation.products}
        </button>
      </div>

      <div className={styles.productSection}>
        <div className={styles.productImage}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <div className={styles.category}>{product.category}</div>
            <h1>{product.name}</h1>
            <div className={styles.rating}>
              <span className={styles.stars}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className={styles.ratingText}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              {product.price.toFixed(2)}
            </div>
            <div className={styles.stockStatus}>
              {product.inStock ? (
                <span className={styles.inStock}>In Stock</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>
          </div>

          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.specifications}>
            <h3>Specifications</h3>
            <div className={styles.specsGrid}>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Volume:</span>
                <span className={styles.specValue}>{product.volume}ml</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Alcohol Content:</span>
                <span className={styles.specValue}>{product.alcoholContent}% ABV</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Origin:</span>
                <span className={styles.specValue}>{product.origin}</span>
              </div>
              <div className={styles.spec}>
                <span className={styles.specLabel}>Category:</span>
                <span className={styles.specValue}>{product.category}</span>
              </div>
            </div>
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className={styles.ingredients}>
              <h3>Ingredients</h3>
              <div className={styles.ingredientsList}>
                {product.ingredients.map((ingredient, index) => (
                  <span key={index} className={styles.ingredient}>
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.addToCartSection}>
            <div className={styles.quantitySelector}>
              <label htmlFor="quantity">Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleQuantityChange(quantity - 1);
                    }
                  }}
                  disabled={quantity <= 1}
                  className={styles.quantityButton}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleQuantityChange(quantity + 1);
                    }
                  }}
                  disabled={quantity >= 10}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>

            <button onClick={handleAddToCart} disabled={!product.inStock} className={styles.addToCartButton}>
              {product.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((relatedProduct) => (
              <button
                key={relatedProduct.id}
                className={styles.relatedCard}
                onClick={() => router.push(`/products/${relatedProduct.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/products/${relatedProduct.id}`);
                  }
                }}
                type="button"
              >
                <div className={styles.relatedImage}>
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                </div>
                <div className={styles.relatedInfo}>
                  <h3>{relatedProduct.name}</h3>
                  <div className={styles.relatedPrice}>
                    <span className={styles.currency}>$</span>
                    {relatedProduct.price.toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
