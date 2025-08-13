'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './breadcrumb.module.scss';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const router = useRouter();

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className={`${styles.breadcrumb} ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
          {item.href || item.onClick ? (
            <button
              className={styles.breadcrumbItem}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item);
                }
              }}
              type="button"
            >
              {item.label}
            </button>
          ) : (
            <span className={styles.breadcrumbItem}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb; 