'use client';
import { useDictionary } from '@/dictionary-provider';
import Link from 'next/link';
import Button from '../Button';
import styles from './heading.module.scss';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useCartStore } from '@/app/zustand/store/cart';
import React from 'react';
import queryString from 'query-string';

export default function Heading() {
  const dictionary = useDictionary();
  const pathname = usePathname();
  const { lang } = useParams();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vodka' | 'gin' | 'family' | 'limited'>('all');
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    setSelectedCategory(parsed.category as 'all' | 'vodka' | 'gin' | 'family' | 'limited')
  }, [window.location.search])

  // Debug: Log cart count changes
  const cartCount = getTotalItems();
  React.useEffect(() => {
    console.log('Heading component - Cart count changed:', cartCount);
  }, [cartCount]);

  // Check if we're on home page or products page
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isProductsPage = pathname === `/${lang}/products`;
  const isCocktailsPage = pathname === `/${lang}/cocktails`;
  const shouldUseDarkColor = !isHomePage && !isProductsPage && !isCocktailsPage;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    console.log('Heading component - Auth state changed:', { isAuthenticated, user });

    // If user is not authenticated and we're on a protected page, redirect to home
    if (!isAuthenticated && pathname.includes('/dashboard')) {
      console.log('Redirecting to home - user not authenticated');
      router.push(`/${lang}`);
    }
  }, [isAuthenticated, pathname, router, lang]);

  const handleLogout = () => {
    console.log('Heading component - Logout button clicked');
    logout();
    console.log('Heading component - Redirecting to home after logout');
    router.push(`/${lang}`);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  return (
    <div className={`${styles.heading} ${isScrolled ? styles.scrolled : ''} ${shouldUseDarkColor ? styles.darkColor : ''}`}>
      {/* Logo */}
      <Link href={`/${lang}`} className={styles.logo}>
        <img src="/img/svg/logo.svg" alt="logo" />
        {/* <div className={styles.logoText}>
          <span className={styles.logoMain}>ISTAK</span>
          <span className={styles.logoSub}>DISTILLERY</span>
        </div> */}
      </Link>

      {/* Navigation */}
      <nav className={styles.navBar}>
        <div
          onMouseEnter={() => setIsProductsDropdownOpen(true)}
          onMouseLeave={() => setIsProductsDropdownOpen(false)}
          className={styles.navItem}
        >
          <button
            className={`${styles.navButton} ${isProductsPage ? styles.active : ''}`}
            onClick={toggleProductsDropdown}

          >
            {dictionary.navigation.products}
          </button>

          {/* Products Dropdown */}
          {isProductsDropdownOpen && (
            <div className={styles.dropdown}

            >
              <Link href={`/${lang}/products?category=gin`} className={`${styles.dropdownItem} ${selectedCategory === 'gin' ? styles.active : ''}`}>
                <span className={styles.dropdownText}>202 ՋԻՆ</span>
                <div className={styles.dropdownHighlight}></div>
              </Link>
              <Link href={`/${lang}/products?category=vodka`} className={`${styles.dropdownItem} ${selectedCategory === 'vodka' ? styles.active : ''}`}>
                <span className={styles.dropdownText}>ԻՍՏԱԿ ՕՂԻ</span>
                <div className={styles.dropdownHighlight}></div>
              </Link>
              <Link href={`/${lang}/products?category=family`} className={`${styles.dropdownItem} ${selectedCategory === 'family' ? styles.active : ''}`}>
                <span className={styles.dropdownText}>SHARLIE ԸՆՏԱՆԻՔ</span>
                <div className={styles.dropdownHighlight}></div>
              </Link>
              <Link href={`/${lang}/products?category=limited`} className={`${styles.dropdownItem} ${selectedCategory === 'limited' ? styles.active : ''}`}>
                <span className={styles.dropdownText}>Լիմիթիե</span>
                <div className={styles.dropdownHighlight}></div>
              </Link>
            </div>
          )}
        </div>

        <Link
          className={`${styles.navLink} ${isCocktailsPage ? styles.active : ''}`}
          href={`/${lang}/cocktails`}
        >
          {dictionary.navigation.cocktails}
        </Link>

        <Link
          className={styles.navLink}
          href={`/${lang}/subscription`}
        >
          {dictionary.navigation.subscription}
        </Link>
      </nav>

      {/* Right Section - Icons and Auth */}
      <div className={styles.rightSection}>
        {/* Search Icon */}
        {/* <button className={styles.iconButton}>
          <img src="/img/svg/search.svg" alt={dictionary.navigation.search} width={20} height={20} />
        </button> */}

        {/* Cart Icon */}
        <Link href={`/${lang}/cart`} className={styles.cartIcon}>
          <img src="/img/svg/cart.svg" alt={dictionary.navigation.cart} width={20} height={20} />
          {getTotalItems() > 0 && <span className={styles.cartBadge}>{getTotalItems()}</span>}
        </Link>

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className={styles.userMenu}>
            <span className={styles.userName}>
              {user?.firstName} {user?.lastName}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              {dictionary.navigation.logout}
            </button>
          </div>
        ) : (
          <div className={styles.authButton}>
            <Link href={`/${lang}/login`}>
              <Button
                text={`${dictionary.navigation.login} / ${dictionary.navigation.register}`}
                variant="light"
                onClick={() => { }}
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
