"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";

// Images from the website
const IMAGES = [
  // Column 1
  "/images/carousel2/191129_B_I_BEAUTY_05.jpg",
  "/images/portfolio/chromatic-study.jpg",
  "/images/carousel2/Beauty Adjacent : Benjamin Vnuk .jpg",
  "/images/portfolio/scarlet-kiss.jpg",
  "/images/carousel2/Studio Nicholson .jpg",
  // Column 2
  "/images/portfolio/cover-vogue.jpg",
  "/images/carousel2/Net A Porter .jpg",
  "/images/portfolio/editorial-outdoor.jpg",
  "/images/carousel2/Wallpaper Magazine .jpg",
  "/images/portfolio/lovewant-georgia.jpg",
  // Column 3
  "/images/carousel2/Beauty : Jack Grange .jpg",
  "/images/portfolio/net-a-porter.jpg",
  "/images/carousel2/Olivia Petronella Palermo_LOVEWANT35 copy.jpg",
  "/images/portfolio/home-background.jpg",
  "/images/carousel2/IMG_9310 copy.jpg",
];

// Split into 3 columns
const COL_1_IMAGES = IMAGES.slice(0, 5);
const COL_2_IMAGES = IMAGES.slice(5, 10);
const COL_3_IMAGES = IMAGES.slice(10, 15);

// Quadruple the images for seamless infinite loop
const COL_1_LOOP = [...COL_1_IMAGES, ...COL_1_IMAGES, ...COL_1_IMAGES, ...COL_1_IMAGES];
const COL_2_LOOP = [...COL_2_IMAGES, ...COL_2_IMAGES, ...COL_2_IMAGES, ...COL_2_IMAGES];
const COL_3_LOOP = [...COL_3_IMAGES, ...COL_3_IMAGES, ...COL_3_IMAGES, ...COL_3_IMAGES];

type ExecutiveImpactCarouselProps = {
  isAtScrollEnd?: boolean; // When true, carousel responds to wheel events globally
}

export default function ExecutiveImpactCarousel({ isAtScrollEnd = false }: ExecutiveImpactCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  
  // Track current Y position in pixels
  const scrollY = useRef({ col1: 0, col2: 0, col3: 0 });
  // Track content heights for wrapping
  const contentHeights = useRef({ col1: 0, col2: 0, col3: 0 });
  
  // Active when hovered OR when at scroll end
  const isActive = isHovered || isAtScrollEnd;

  // Calculate content heights on mount
  useEffect(() => {
    const updateHeights = () => {
      if (col1Ref.current) {
        // Each set is 1/4 of total height (since we quadrupled)
        contentHeights.current.col1 = col1Ref.current.scrollHeight / 4;
      }
      if (col2Ref.current) {
        contentHeights.current.col2 = col2Ref.current.scrollHeight / 4;
      }
      if (col3Ref.current) {
        contentHeights.current.col3 = col3Ref.current.scrollHeight / 4;
      }
      
      // Initialize to middle position (show 2nd set)
      scrollY.current.col1 = -contentHeights.current.col1;
      scrollY.current.col2 = -contentHeights.current.col2;
      scrollY.current.col3 = -contentHeights.current.col3;
      
      if (col1Ref.current) gsap.set(col1Ref.current, { y: scrollY.current.col1 });
      if (col2Ref.current) gsap.set(col2Ref.current, { y: scrollY.current.col2 });
      if (col3Ref.current) gsap.set(col3Ref.current, { y: scrollY.current.col3 });
    };
    
    // Small delay to ensure images have started loading
    setTimeout(updateHeights, 100);
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, []);

  const wrapValue = (value: number, min: number, max: number): number => {
    const range = max - min;
    while (value < min) value += range;
    while (value >= max) value -= range;
    return value;
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isActive) return;
    
    const delta = e.deltaY * 0.8; // Sensitivity
    
    // Check if at top limit trying to scroll up (to escape back to horizontal scroll)
    const height1 = contentHeights.current.col1;
    const newCol1 = scrollY.current.col1 - delta;
    
    // If scrolling up and near the top reset point, allow escape
    if (delta < 0 && scrollY.current.col1 <= -height1 * 0.5) {
      // Allow horizontal scroll to take over
      return;
    }
    
    // Block horizontal scroll when active
    e.preventDefault();
    e.stopPropagation();
    
    // Update positions with wrapping for infinite loop
    const height2 = contentHeights.current.col2;
    const height3 = contentHeights.current.col3;
    
    // Column 1 & 3 scroll down (negative delta = scroll up visually)
    scrollY.current.col1 = wrapValue(scrollY.current.col1 - delta, -height1 * 2, 0);
    scrollY.current.col3 = wrapValue(scrollY.current.col3 - delta, -height3 * 2, 0);
    
    // Column 2 scrolls opposite
    scrollY.current.col2 = wrapValue(scrollY.current.col2 + delta, -height2 * 2, 0);
    
    // Animate
    if (col1Ref.current) {
      gsap.to(col1Ref.current, {
        y: scrollY.current.col1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
    
    if (col2Ref.current) {
      gsap.to(col2Ref.current, {
        y: scrollY.current.col2,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
    
    if (col3Ref.current) {
      gsap.to(col3Ref.current, {
        y: scrollY.current.col3,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // When at scroll end, listen on window for wheel events anywhere
    // Otherwise, only listen on the container (when hovered)
    if (isAtScrollEnd) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, isAtScrollEnd]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white overflow-hidden m-0 p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-3 gap-3 md:gap-4 h-full w-full px-2 md:px-4 m-0">
        {/* Column 1 */}
        <div className="h-full overflow-hidden relative">
          <div ref={col1Ref} className="flex flex-col gap-3 md:gap-4 will-change-transform">
            {COL_1_LOOP.map((src, i) => (
              <ImageCard key={i} src={src} />
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="h-full overflow-hidden relative">
          <div ref={col2Ref} className="flex flex-col gap-3 md:gap-4 will-change-transform">
            {COL_2_LOOP.map((src, i) => (
              <ImageCard key={i} src={src} />
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="h-full overflow-hidden relative">
          <div ref={col3Ref} className="flex flex-col gap-3 md:gap-4 will-change-transform">
            {COL_3_LOOP.map((src, i) => (
              <ImageCard key={i} src={src} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ src }: { src: string }) {
  return (
    <figure className="m-0 p-0 w-full bg-transparent shrink-0">
      <div className="relative aspect-[0.8] w-full overflow-hidden bg-stone-100">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
    </figure>
  );
}
