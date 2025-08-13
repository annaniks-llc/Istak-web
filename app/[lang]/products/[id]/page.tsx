'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductsStore } from '@/app/zustand/store/products';
import { useCartStore } from '@/app/zustand/store/cart';
import toast from 'react-hot-toast';
import styles from './product-details.module.scss';
import { useDictionary } from '@/dictionary-provider';
import Breadcrumb from '../../components/Breadcrumb';
import ProductImageScroll from '@/app/[lang]/components/ProductImageScroll';

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState(0.5);
  const [isContainerScrolling, setIsContainerScrolling] = useState(false);
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { lang } = params;

  const { getProductById, getProductsByCategory, products, isLoading, fetchProducts } = useProductsStore();
  const { addItem } = useCartStore();
  const dictionary = useDictionary();

  const product = getProductById(productId);
  const relatedProducts = product
    ? getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
    : [];

  // Product images - first image and second image
  const productImages = product ? [
    product.image, // First image (original)
    "/img/png/drink1.png", // Second image (variation)
    "/img/png/drink2.png" // Third image (another variation)
  ] : [];

  // Debug: log the images array
  console.log('Product Images:', productImages);
  console.log('Product:', product);

  useEffect(() => {
    // Fetch products if they haven't been loaded yet
    if (products.length === 0) {
      void fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    // Check if product exists after products are loaded
    if (!isLoading && products.length > 0 && !product) {
      toast.error('Product not found');
      router.push(`/${lang}/products`);
    }
  }, [isLoading, products.length, product, router, lang, productId]);

  // Custom scroll behavior for product image container
  useEffect(() => {
    let isContainerScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      const container = document.querySelector(`.${styles.productImageContainer}`);
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Debug logging
      console.log('Wheel event:', {
        deltaY: e.deltaY,
        containerTop: containerRect.top,
        containerBottom: containerRect.bottom,
        windowHeight,
        inContainer: containerRect.top <= windowHeight && containerRect.bottom >= 0
      });

      // Check if we're in the image container area
      if (containerRect.top <= windowHeight && containerRect.bottom >= 0) {
        const containerElement = container as HTMLElement;
        const currentScrollTop = containerElement.scrollTop;
        const maxScrollTop = containerElement.scrollHeight - containerElement.clientHeight;
        
        console.log('Container scroll info:', {
          currentScrollTop,
          maxScrollTop,
          scrollHeight: containerElement.scrollHeight,
          clientHeight: containerElement.clientHeight
        });
        
        // Check if we can scroll within the container
        if (currentScrollTop > 0 || e.deltaY < 0) {
          // We can scroll up or we're scrolling down and not at bottom
          if (!(currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
            // Prevent window scroll and handle container scroll instead
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Scrolling within container');
            
            // Apply scroll to the container
            containerElement.scrollTop += e.deltaY;
            setIsContainerScrolling(true);
            return;
          }
        } else if (e.deltaY > 0) {
          // We're at the top and scrolling down - start container scroll
          e.preventDefault();
          e.stopPropagation();
          
          console.log('Starting container scroll');
          
          containerElement.scrollTop += e.deltaY;
          setIsContainerScrolling(true);
          return;
        }
      }
      
      // If we get here, allow normal window scrolling
      console.log('Allowing normal window scroll');
      setIsContainerScrolling(false);
    };

    const handleScroll = () => {
      if (isContainerScrolling) return;

      const container = document.querySelector(`.${styles.productImageContainer}`);
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When container enters viewport, prepare for container scrolling
      if (containerRect.top <= windowHeight && containerRect.top > 0) {
        // Container is in view - scroll events will be handled by wheel handler
        setIsContainerScrolling(false);
      }
    };

    // Add event listeners
    const container = document.querySelector(`.${styles.productImageContainer}`);
    if (container) {
      container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel as EventListener);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [styles.productImageContainer]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: typeof product.name === 'string' ? product.name : product.name.en,
        price: product.price,
        volume: selectedVolume * 1000, // Convert to ml
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

  const getLocalizedText = (text: string | { en: string; hy: string; ru: string }) => {
    if (typeof text === 'string') {
      return text;
    }
    return text[lang as keyof typeof text] || text.en;
  };

  // Show loading state while fetching products
  if (isLoading || products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{dictionary.common.loading}</p>
        </div>
      </div>
    );
  }

  // Show error state if product not found
  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Product not found</p>
          <button
            onClick={() => router.push(`/${lang}/products`)}
            className={styles.backButton}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const volumeOptions = [0.5, 0.75, 1.0];

  // Prepare breadcrumb items
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
      label: product.category.toUpperCase()
    },
    {
      label: getLocalizedText(product.name).toUpperCase()
    }
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.productSection}>
        <div className={styles.productImageContainer}>
          <img
            src={product.image}
            alt={getLocalizedText(product.name)}
            className={styles.mainImage}
          />
          <img
            src={product.image}
            alt={getLocalizedText(product.name)}
            className={styles.mainImage}
          />
          
          {/* Debug indicator */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            <div>Container Height: 750px</div>
            <div>Images: 2</div>
            <div>Scroll Active: {isContainerScrolling ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h1 className={styles.productTitle}>{getLocalizedText(product.name)}</h1>
            <div className={styles.productPrice}>
              {product.price} Դր
            </div>
          </div>

          <div className={styles.productAttributes}>
            <div className={styles.attribute}>
              <span className={styles.attributeLabel}>ԱՐՏԱԴՐՄԱՆ ԵՐԿԻՐ :</span>
              <span className={styles.attributeValue}>{getLocalizedText(product.origin)}</span>
            </div>
            <div className={styles.attribute}>
              <span className={styles.attributeLabel}>ԱԼԿՈՀՈԼԻ ՔԱՆԱԿԸ:</span>
              <span className={styles.attributeValue}>{product.alcoholContent}%</span>
            </div>
          </div>

          <div className={styles.volumeSelection}>
            <span className={styles.volumeLabel}>ԾԱՎԱԼԸ:</span>
            <div className={styles.volumeButtons}>
              {volumeOptions.map((volume) => (
                <button
                  key={volume}
                  className={`${styles.volumeButton} ${selectedVolume === volume ? styles.selected : ''}`}
                  onClick={() => setSelectedVolume(volume)}
                  type="button"
                >
                  {volume} L
                </button>
              ))}
            </div>
          </div>

          <div className={styles.description}>
            <p>{getLocalizedText(product.description)}</p>
          </div>

          <div className={styles.quantitySection}>
            <span className={styles.quantityLabel}>ՔԱՆԱԿԸ</span>
            <div className={styles.quantityControls}>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.wishlistButton}>
              Add To Wishlist
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={styles.addToCartButton}
            >
              Add To Cart
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
                onClick={() => router.push(`/${lang}/products/${relatedProduct.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/${lang}/products/${relatedProduct.id}`);
                  }
                }}
                type="button"
              >
                <div className={styles.relatedImage}>
                  <img src={relatedProduct.image} alt={getLocalizedText(relatedProduct.name)} />
                </div>
                <div className={styles.relatedInfo}>
                  <h3>{getLocalizedText(relatedProduct.name)}</h3>
                  <div className={styles.relatedPrice}>
                    {relatedProduct.price} Դր
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
