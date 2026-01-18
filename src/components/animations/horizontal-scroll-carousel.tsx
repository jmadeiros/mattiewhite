"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type MediaProps = {
  src: string
  alt: string
  type?: "image" | "video"
  title?: string
  category?: string
}

type HorizontalScrollCarouselProps = {
  media: MediaProps[]
  onExploreClick?: () => void
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

export function HorizontalScrollCarousel({ media, onExploreClick }: HorizontalScrollCarouselProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"])

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
                  {String(index + 1).padStart(2, "0")} — {item.category || "Editorial"}
                </p>
                <p className="text-sm text-stone-600 font-light mt-1">{item.title || item.alt}</p>
              </div>
            </div>
          ))}

          {/* Explore More Card at the end */}
          <div className="w-[300px] md:w-[400px] shrink-0 flex flex-col justify-center items-center h-[450px] md:h-[600px] bg-stone-50 border border-stone-100">
            <Button
              variant="outline"
              onClick={() => {
                onExploreClick?.()
                // Scroll to top of portfolio section
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }, 100)
              }}
              className="group relative border border-black text-black hover:text-white transition-all duration-700 px-12 py-5 text-xs uppercase tracking-[0.25em] bg-transparent overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-black/10 rounded-none"
            >
              <span className="relative z-10 flex items-center transition-transform duration-300">
                Explore All
              </span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
