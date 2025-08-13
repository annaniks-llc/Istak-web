"use client";
import { useEffect, useRef, useState } from "react";
import "./ProductImageScroll.css";

export default function ProductImageScroll({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const handleScroll = () => {
      const sectionHeight = window.innerHeight;
      const index = Math.min(
        images.length - 1,
        Math.floor(window.scrollY / sectionHeight)
      );
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentIndex, images]);

  return (
    <div className="product-image-scroll">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Product view ${idx + 1}`}
          className={idx === currentIndex ? "active" : ""}
        />
      ))}
    </div>
  );
}
