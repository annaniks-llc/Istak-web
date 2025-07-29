"use client"
import { useDictionary } from '@/dictionary-provider';
import Link from 'next/link';
import Button from '../Button';
import styles from './heading.module.scss';
import { usePathname } from 'next/navigation';

export default function Heading() {
  const dictionary = useDictionary();
  const pathname = usePathname();
  return (
    <div className={styles.heading}>
      <img src="/img/svg/logo.svg" alt="logo" width={100} height={100} />
      <nav className={styles.navBar}>
        <Link className={`${styles.link} ${!pathname.includes("about") && !pathname.includes("contact") ? styles.active : ""}`} href="/">Home</Link>
        <Link className={`${styles.link} ${pathname.includes("about") ? styles.active : ""}`} href="/about">About</Link>
        <Link className={`${styles.link} ${pathname.includes("contact") ? styles.active : ""}`} href="/contact">Contact</Link>
      </nav>
      <div className={styles.icons}>
        <img src="/img/svg/cart.svg" alt="card" width={16} height={16} />
        <img src="/img/svg/search.svg" alt="search" width={16} height={16} />
        <Button text={dictionary.home.menu.register} variant="light" onClick={() => { }} />
      </div>
    </div>
  );
}
