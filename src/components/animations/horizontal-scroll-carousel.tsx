"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"

type MediaProps = {
  src: string
  alt: string
  type?: "image" | "video"
  title?: string
  category?: string
}

type HorizontalScrollCarouselProps = {
  media: MediaProps[]
  children?: React.ReactNode
  scrollEndPercent?: string // How far to scroll (default "-88%")
  onAtEnd?: (isAtEnd: boolean) => void // Callback when scroll reaches end
}

function VideoItem({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { margin: "200px" })
  
  useEffect(() => {
    if (ref.current) {
      if (isInView) {
        ref.current.play().catch(() => {})
      } else {
        ref.current.pause()
      }
    }
  }, [isInView])

  return (
    <video
      ref={ref}
      src={src}
      title={alt}
      loop
      muted
      playsInline
      preload="none"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
    />
  )
}

export function HorizontalScrollCarousel({ media, children, scrollEndPercent = "-88%", onAtEnd }: HorizontalScrollCarouselProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", scrollEndPercent])
  const footerOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1])
  const footerY = useTransform(scrollYProgress, [0.85, 0.95], [20, 0])

  // Track when scroll is at end (progress > 0.95)
  useEffect(() => {
    if (!onAtEnd) return
    
    const unsubscribe = scrollYProgress.on("change", (value) => {
      onAtEnd(value > 0.95)
    })
    
    return () => unsubscribe()
  }, [scrollYProgress, onAtEnd])

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div 
          style={{ x, willChange: "transform" }} 
          className="flex gap-8"
        >
          {media.map((item, index) => (
            <div
              key={index}
              className="group relative w-[300px] md:w-[400px] shrink-0 flex flex-col"
            >
              <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden bg-stone-100">
                {item.type === "video" ? (
                  <VideoItem src={item.src} alt={item.alt} />
                ) : (
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    quality={75}
                    loading="lazy"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                )}
              </div>
              
              {/* Image annotation on hover */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-stone-400 tracking-[0.2em] uppercase">
                  {String(index + 1).padStart(2, "0")} — {item.title || item.alt}
                </p>
              </div>
            </div>
          ))}
          {children}
        </motion.div>

        {/* Footer Overlay - Appears at end of scroll */}
        <motion.div 
          style={{ opacity: footerOpacity, y: footerY }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/90 backdrop-blur-sm border-t border-stone-100 z-50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            {/* Left: Copyright & Credit */}
            <div className="flex items-center gap-4 text-[10px] text-stone-400 uppercase tracking-widest font-light">
              <p>&copy; {new Date().getFullYear()} Mattie White</p>
              <span className="text-stone-300">|</span>
              <a 
                href="https://scailer.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-stone-600 transition-colors"
              >
                Designed by Scailer
              </a>
            </div>

            {/* Right: Socials */}
            <div className="flex items-center gap-6">
              <Link href="https://www.instagram.com/mattiewhite_makeup/" target="_blank" aria-label="Instagram" className="text-stone-500 hover:text-black transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
