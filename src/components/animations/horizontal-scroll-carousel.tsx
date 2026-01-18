"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"

type MediaProps = {
  src: string
  alt: string
  type?: "image" | "video"
  title?: string
  category?: string
}

type HorizontalScrollCarouselProps = {
  media: MediaProps[]
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

export function HorizontalScrollCarousel({ media }: HorizontalScrollCarouselProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-87%"])

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
        </motion.div>
      </div>
    </section>
  )
}
