'use client';
import { useDictionary } from '@/dictionary-provider';
import Link from 'next/link';
import Button from '../Button';
import styles from './heading.module.scss';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/zustand/store/auth';
import { useCartStore } from '@/app/zustand/store/cart';

export default function Heading() {
  const dictionary = useDictionary();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${styles.heading} ${isScrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <img src="/img/svg/logo.svg" alt="logo" width={100} height={100} />
      </Link>

      <nav className={styles.navBar}>
        <Link className={`${styles.link} ${pathname === '/' ? styles.active : ''}`} href="/">
          {dictionary.navigation.home}
        </Link>
        <Link className={`${styles.link} ${pathname === '/products' ? styles.active : ''}`} href="/products">
          {dictionary.navigation.products}
        </Link>
        {isAuthenticated && (
          <Link className={`${styles.link} ${pathname === '/dashboard' ? styles.active : ''}`} href="/dashboard">
            {dictionary.navigation.dashboard}
          </Link>
        )}
      </nav>

      <div className={styles.icons}>
        <Link href="/cart" className={styles.cartIcon}>
          <img src="/img/svg/cart.svg" alt={dictionary.navigation.cart} width={16} height={16} />
          {getTotalItems() > 0 && <span className={styles.cartBadge}>{getTotalItems()}</span>}
        </Link>
        <img src="/img/svg/search.svg" alt={dictionary.navigation.search} width={16} height={16} />

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
          <div className={styles.authButtons}>
            <Link href="/login">
              <Button text={dictionary.navigation.login} variant="light" onClick={() => {}} />
            </Link>
            <Link href="/register">
              <Button text={dictionary.navigation.register} variant="light" onClick={() => {}} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
