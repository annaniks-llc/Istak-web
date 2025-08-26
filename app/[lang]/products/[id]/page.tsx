'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, useProductsStore } from '@/app/zustand/store/products';
import { useCartStore } from '@/app/zustand/store/cart';
import toast from 'react-hot-toast';
import styles from './product-details.module.scss';
import { useDictionary } from '@/dictionary-provider';
import Breadcrumb from '../../components/Breadcrumb';
import ProductImageScroll from '@/app/[lang]/components/ProductImageScroll';
import Button from '../../components/Button';
import ProductCard from '../../components/ProductCard';

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState(0.5);
  const [selectedImage, setSelectedImage] = useState<number>(0);
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

  // Calculate dynamic price based on selected volume
  const calculatePrice = (basePrice: number, baseVolume: number, selectedVolume: number) => {
    // Base price is for 0.5L, calculate proportional price for other volumes
    const pricePerLiter = basePrice / baseVolume;
    return Math.round((pricePerLiter * selectedVolume) * 100) / 100; // Round to 2 decimal places
  };

  const currentPrice = product ? calculatePrice(product.price, 0.5, selectedVolume) : 0;
  console.log(relatedProducts, "relatedProductsrelatedProducts");

  // Product images - first image and second image
  const productImages = product ? [
    product.image, // First image (original)
    "/img/png/drink1.png", // Second image (variation)
    "/img/png/drink2.png",
    "/img/png/drink2.png",
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




  const handleAddToCart = (item?: Product) => {
    if (!product) return;
    const productForCard = item ? item : product
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: productForCard.id,
        name: typeof productForCard.name === 'string' ? productForCard.name : productForCard.name.en,
        price: item ? productForCard.price : currentPrice, // Use current price for main product, base price for related products
        volume: selectedVolume * 1000, // Convert to ml
        image: productForCard.image,
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
          {/* Main image */}
          <div className={styles.mainImageWrapper}>
            <img
              src={productImages[selectedImage]}
              alt={getLocalizedText(product.name)}
              className={styles.mainImage}
            />
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className={styles.thumbnailGrid}>
              {productImages.map((img, index) =>
                (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`${styles.thumbnailButton} ${selectedImage === index ? styles.active : ''}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h1 className={styles.productTitle}>{getLocalizedText(product.name)}</h1>
            <div className={styles.productPrice}>
              {currentPrice} Դր

            </div>
            {/* <div className={styles.pricePerLiter}>
              {product.price / 0.5} Դր/լ
            </div> */}
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
              {volumeOptions.map((volume) => {
                const volumePrice = calculatePrice(product.price, 0.5, volume);
                return (
                  <button
                    key={volume}
                    className={`${styles.volumeButton} ${selectedVolume === volume ? styles.selected : ''}`}
                    onClick={() => setSelectedVolume(volume)}
                    type="button"
                    title={`${volumePrice} Դր`}
                  >
                    {volume} L
                  </button>
                );
              })}
            </div>

          </div>

          <div className={styles.description}>
            <p>{getLocalizedText(product.description)}</p>
          </div>

          <div className={styles.quantitySelector}>
            <label htmlFor="quantity">Քանակ </label>
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
              <div className={styles.quantity}>{quantity}</div>
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

          <div className={styles.actionButtons}>
            <Button text="Ավելացնել Զամբյուղ" variant="primary" onClick={handleAddToCart} />

          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>այլ ապրանքներ</h2>
          <div className={styles.relatedGrid}>
            {products.map((item) => (
              <ProductCard
                key={item.id}
                title={item.name}
                prise={item.price}
                volume={item.volume}
                src={item.image}
                onAddToCart={() => handleAddToCart(item)}
                goTo={() => router.push(`/${lang}/products/${item.id}`)}
                disabled={!item.inStock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
