'use client';
import { useDictionary } from '@/dictionary-provider';
import styles from './footer.module.scss';

export default function Footer() {
  const dictionary = useDictionary();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img src="/img/svg/logo.svg" alt="logo" />
          {/* <div className={styles.logo}>{dictionary.footer.istak.title}</div>
          <div className={styles.subtitle}>{dictionary.footer.istak.subtitle}</div> */}
        </div>

        {/* ISTAK Products */}
        <div className={styles.productSection}>
          <h3>{dictionary.footer.istak.title}</h3>
          <ul>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.istak.products.barlieMalt}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.istak.products.wheatMalt}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.istak.products.maltMix}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.istak.products.nightLife}
              </button>
            </li>
          </ul>
        </div>

        {/* 202 GIN FAMILY */}
        <div className={styles.productSection}>
          <h3>{dictionary.footer.ginFamily.title}</h3>
          <ul>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.ginFamily.barEdition}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.ginFamily.dryGin}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.ginFamily.mandarin}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.ginFamily.christmasEdition}
              </button>
            </li>
          </ul>
        </div>

        {/* SHARLIE FAMILY */}
        <div className={styles.productSection}>
          <h3>{dictionary.footer.sharlieFamily.title}</h3>
          <ul>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.sharlieFamily.sharlieXO}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.sharlieFamily.sharlieVSOP}
              </button>
            </li>
          </ul>
        </div>

        {/* News Section */}
        <div className={styles.newsSection}>
          <h3> </h3>
          <ul>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.news.title}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.news.opinions}
              </button>
            </li>
            <li>
              <button type="button" className={styles.linkButton}>
                {dictionary.footer.news.community}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h3>{dictionary.footer.contact.title}</h3>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.text}>{dictionary.footer.contact.address}</div>
            </div>
            <div className={styles.contactItem}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <a href={`mailto:${dictionary.footer.contact.email}`} className={styles.text}>
                {dictionary.footer.contact.email}
              </a>
            </div>
            <div className={styles.contactItem}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <a href={`tel:${dictionary.footer.contact.phone}`} className={styles.text}>
                {dictionary.footer.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>{dictionary.footer.copyright}</div>
        <div className={styles.socialIcons}>
          <div className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>
          <div className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
            </svg>
          </div>
          <div className={styles.socialIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
