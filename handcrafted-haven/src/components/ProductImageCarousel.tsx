"use client";

import { useMemo, useState } from "react";

type ProductImageCarouselProps = {
  images: string[];
  alt: string;
};

export default function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const showPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index: number) => setCurrentIndex(index);

  // Compute which 3 thumbnails to show so the active image stays visible.
  const { startIndex, visibleThumbs } = useMemo(() => {
    const visibleCount = 3;

    if (images.length <= visibleCount) {
      return { startIndex: 0, visibleThumbs: images.map((img, index) => ({ img, index })) };
    }

    const maxStart = images.length - visibleCount;
    const start = Math.max(0, Math.min(currentIndex - 1, maxStart));

    const slice = images.slice(start, start + visibleCount).map((img, i) => ({
      img,
      index: start + i,
    }));

    return { startIndex: start, visibleThumbs: slice };
  }, [images, currentIndex]);

  return (
    <>
      {/* Main image */}
      <div className="media__main">
        <img src={images[currentIndex]} alt={alt} className="media__mainImg" />
      </div>

      {/* Thumbnails + arrows */}
      <div className="media__thumbRow">
        <button className="thumbNav" type="button" onClick={showPrev} aria-label="Previous image">
          ‹
        </button>

        {visibleThumbs.map(({ img, index }) => (
          <div
            key={img}
            className={`thumb ${index === currentIndex ? "thumb--active" : ""}`}
            onClick={() => selectImage(index)}
          >
            <img src={img} alt="" className="thumb__img" />
          </div>
        ))}

        <button className="thumbNav" type="button" onClick={showNext} aria-label="Next image">
          ›
        </button>
      </div>
    </>
  );
}
