"use client";

import { useMemo, useState } from "react";
import Image from "next/image";


type ProductImageCarouselProps = {
  images: string[];
  alt: string;
};

export default function ProductImageCarousel({ images = [], alt }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index: number) => setCurrentIndex(index);

  const visibleThumbs = useMemo(() => {
    const visibleCount = 3;

    if (!images || images.length === 0) return [];

    if (images.length <= visibleCount) {
      return images.map((img, index) => ({ img, index }));
    }

    const maxStart = images.length - visibleCount;
    const start = Math.max(0, Math.min(currentIndex - 1, maxStart));

    return images.slice(start, start + visibleCount).map((img, i) => ({
      img,
      index: start + i,
    }));
  }, [images, currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="media__main">
        <Image
          src={images[currentIndex]}
          alt={alt}
          fill
          className="media__mainImg"
          sizes="(max-width: 900px) 100vw, 600px"
        />
      </div>

      <div className="media__thumbRow">
        <button type="button" className="thumbNav" onClick={showPrev} aria-label="Previous image">
          ‹
        </button>

        {visibleThumbs.map(({ img, index }) => (
          <div
            key={img}
            className={`thumb ${index === currentIndex ? "thumb--active" : ""}`}
            onClick={() => selectImage(index)}
          >
            <Image
              src={img}
              alt=""
              fill
              className="thumb__img"
              sizes="100px"
            />
          </div>
        ))}

        <button type="button" className="thumbNav" onClick={showNext} aria-label="Next image">
          ›
        </button>
      </div>
    </>
  );
}
