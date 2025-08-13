'use client';

import React, { useState, useEffect } from 'react';
import { useProductsStore, Product } from '@/app/zustand/store/products';
import { useCartStore } from '@/app/zustand/store/cart';
import toast from 'react-hot-toast';
import styles from './products.module.scss';
import { useDictionary } from '@/dictionary-provider';
import ProductCard from '../components/ProductCard';

const categories = ['all', 'vodka', 'cocktail', 'whiskey', 'rum', 'gin', 'tequila', 'wine', 'beer'] as const;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Product['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { products, isLoading, fetchProducts, searchProducts } = useProductsStore();
  const { addItem } = useCartStore();
  const dictionary = useDictionary();

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    // Handle multilingual product name
    const productName = typeof product.name === 'string' 
      ? product.name 
      : product.name.en || 'Product';
    
    addItem({
      id: product.id,
      name: productName,
      price: product.price,
      volume: product.volume,
      image: product.image,
    });
    toast.success(`${productName} added to cart!`);
  };

  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery);
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = typeof a.name === 'string' ? a.name.toLowerCase() : a.name.en.toLowerCase();
          bValue = typeof b.name === 'string' ? b.name.toLowerCase() : b.name.en.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = typeof a.name === 'string' ? a.name.toLowerCase() : a.name.en.toLowerCase();
          bValue = typeof b.name === 'string' ? b.name.toLowerCase() : b.name.en.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, sortOrder, searchProducts]);

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

  return (
    <>
      <div className={styles.topSection}>
        <div className={styles.topSectionContent}>
          <div className={styles.breadcrumb}>
            <span>{dictionary.navigation.home}</span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span>{dictionary.products.title}</span>
            {/* <span className={styles.breadcrumbSeparator}>/</span>
            <span>{dictionary.products.categories.all}</span> */}
          </div>
          <h1 className={styles.mainTitle}>
            {dictionary.products.title}
          </h1>
          {/* <p className={styles.subtitle}>
            {dictionary.products.subtitle}
          </p> */}
        </div>
      </div>
      <div className={styles.container}>
        {/* Top Section with Background Image */}

        {/* 
      <div className={styles.header}>
        <h1>{dictionary.products.title}</h1>
        <p>{dictionary.products.subtitle}</p>
      </div> */}

        {/* <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={dictionary.products.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <div className={styles.categoryFilter}>
            <label>{dictionary.products.filters.category}:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | Product['category'])}
              className={styles.select}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all'
                    ? dictionary.products.categories.all
                    : dictionary.products.categories[category as keyof typeof dictionary.products.categories]}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sortControls}>
            <label>{dictionary.products.filters.sortBy}:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
              className={styles.select}
            >
              <option value="name">{dictionary.products.filters.sortOptions.name}</option>
              <option value="price">{dictionary.products.filters.sortOptions.price}</option>
              <option value="rating">{dictionary.products.filters.sortOptions.rating}</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className={styles.sortButton}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div> */}

        {/* <div className={styles.results}>
        <p className={styles.resultsCount}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div> */}

        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{dictionary.products.search.noResults}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={styles.clearFiltersButton}
            >
              {dictionary.products.filters.clear}
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => {
              return <ProductCard
                key={product.id}
                title={product.name}
                prise={product.price}
                volume={product.volume}
                src={product.image}
                onAddToCart={() => handleAddToCart(product)}
                disabled={!product.inStock}
                showAddToCartButton={false}
              />
            })}
          </div>
        )}
      </div>
    
    </>

  );
}
