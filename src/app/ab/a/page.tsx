"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { HorizontalScrollCarousel } from "@/components/animations/horizontal-scroll-carousel"
import { portfolioImages } from "@/data/portfolio"

const HERO_IMAGES = [
  "/images/portfolio/cover-vogue.jpg",
  "/images/portfolio/chromatic-study.jpg",
  "/images/portfolio/editorial-outdoor.jpg",
  "/images/portfolio/lovewant-georgia.jpg",
  "/images/portfolio/net-a-porter.jpg",
  "/images/carousel/dior-editorial.jpg",
  "/images/carousel/vogue-arabia.jpeg",
]

const horizontalScrollMedia = [
  { src: "/images/showreel/Beauty---Jack-Grange-.jpg", alt: "Beauty – Jack Grange", title: "Jack Grange", category: "Beauty", type: "image" as const },
  { src: "/images/showreel/Beauty-Adjacent---Benjamin-Vnuk-.jpg", alt: "Beauty Adjacent – Benjamin Vnuk", title: "Benjamin Vnuk", category: "Beauty Adjacent", type: "image" as const },
  { src: "/images/showreel/BOSS.mp4", alt: "BOSS Campaign", title: "BOSS Campaign", category: "Commercial", type: "video" as const },
  { src: "/images/showreel/Cos-.jpg", alt: "COS Editorial", title: "COS", category: "Editorial", type: "image" as const },
  { src: "/images/showreel/Net-A-Porter-.jpg", alt: "Net A Porter", title: "Net A Porter", category: "Commercial", type: "image" as const },
  { src: "/images/showreel/Olivia-Petronella-Palermo_LOVEWANT35-copy.jpg", alt: "Olivia Palermo – LOVEWANT", title: "Olivia Palermo", category: "Celebrity", type: "image" as const },
  { src: "/images/showreel/Selfridges-.mp4", alt: "Selfridges Campaign", title: "Selfridges", category: "Campaign", type: "video" as const },
  { src: "/images/showreel/Studio-Nicholson-.jpg", alt: "Studio Nicholson", title: "Studio Nicholson", category: "Editorial", type: "image" as const },
  { src: "/images/showreel/Stusio-Nicholson.mp4", alt: "Studio Nicholson Video", title: "Studio Nicholson", category: "Motion", type: "video" as const },
  { src: "/images/showreel/Wallpaper-Magazine-.jpg", alt: "Wallpaper Magazine", title: "Wallpaper Magazine", category: "Editorial", type: "image" as const },
]

// VERSION A: Tight spacing, dim + caption overlay in center, no zoom
export default function ABTestA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const imagesY = useTransform(scrollYProgress, [0, 0.35, 0.60, 1.0], ["100vh", "0vh", "0vh", "-100vh"])
  const imagesOpacity = useTransform(scrollYProgress, [0, 0.20], [0, 1])
  const logoY = useTransform(scrollYProgress, [0, 0.60, 1.0], ["0vh", "0vh", "-100vh"])
  const arrowOpacity = useTransform(scrollYProgress, [0.30, 0.40, 0.50, 0.60], [0, 1, 1, 0])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullPortfolio, setShowFullPortfolio] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 180)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-white text-black relative">
      <Navbar onPortfolioClick={() => {
        setShowFullPortfolio(true)
        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 100)
      }} variant="smart" />
      
      <main className="flex-grow">
        <section ref={heroRef} className={showFullPortfolio ? "relative h-[400vh] w-full hidden" : "relative h-[400vh] w-full"}>
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 z-40 mix-blend-difference pointer-events-none select-none will-change-transform"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: logoY, translateY: "-50%" }}
          >
            <div className="flex font-euclid font-light text-white leading-none tracking-tight items-baseline">
              <span className="text-[40vw] md:text-[28vw] block transform translate-y-[0.08em]">M</span>
              <span className="text-[40vw] md:text-[28vw] block -ml-[10.6vw] md:-ml-[7.5vw]" style={{ transform: 'scaleY(-1) translateY(-0.1em)' }}>M</span>
            </div>
          </motion.div>

          <motion.div 
            className="fixed top-1/2 left-1/2 z-30 w-[75vw] md:w-[28vw] aspect-[3/4] shadow-2xl overflow-hidden bg-stone-200 will-change-transform"
            style={{ x: "-50%", y: imagesY, opacity: imagesOpacity, translateY: "-50%" }}
          >
            {HERO_IMAGES.map((img, index) => (
              <img
                key={img}
                src={img || "/placeholder.svg"}
                alt={`Portfolio ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-none ${index === currentImageIndex ? "opacity-100 block" : "opacity-0 hidden"}`}
                style={{ filter: "contrast(110%)" }}
              />
            ))}
            <div className="absolute -bottom-8 -left-8 hidden md:block z-20 mix-blend-difference text-white">
              <p className="font-serif text-4xl leading-tight italic">
                {currentImageIndex % 4 === 0 && "Mood"}
                {currentImageIndex % 4 === 1 && "Form"}
                {currentImageIndex % 4 === 2 && "Light"}
                {currentImageIndex % 4 === 3 && "Soul"}
              </p>
            </div>
          </motion.div>

          <motion.div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ opacity: arrowOpacity }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-400">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </section>
      
      <section id="portfolio" className="py-32 md:py-48 bg-white relative">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <ScrollReveal>
            <div className="text-center mb-24 md:mb-32">
              <AnimatePresence mode="wait">
                {!showFullPortfolio ? (
                  <motion.h2 key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-5xl md:text-7xl lg:text-8xl font-thin text-black tracking-[0.4em] uppercase">Selected Works</motion.h2>
                ) : (
                  <motion.h2 key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-5xl md:text-7xl lg:text-8xl font-thin text-black tracking-[0.4em] uppercase">Portfolio</motion.h2>
                )}
              </AnimatePresence>
              <div className="w-32 h-[1px] bg-black mx-auto my-12" />
            </div>
          </ScrollReveal>
          
          <AnimatePresence mode="wait">
            {!showFullPortfolio ? (
              <motion.div key="featured" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto space-y-24 md:space-y-40">
                {/* Featured items same as main */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                  <div className="md:col-span-7 group cursor-pointer">
                    <ScrollReveal>
                      <div className="aspect-[4/5] overflow-hidden bg-stone-50 relative">
                        <Image src={portfolioImages[0].src || "/placeholder.svg"} alt={portfolioImages[0].alt} fill className="object-cover" />
                      </div>
                    </ScrollReveal>
                  </div>
                  <div className="md:col-span-5 text-right">
                    <ScrollReveal delay={0.2}>
                      <p className="text-sm text-stone-400 tracking-[0.2em] uppercase mb-4">01 — {portfolioImages[0].category}</p>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-black mb-6">{portfolioImages[0].title}</h3>
                      <p className="text-base text-stone-500 font-light leading-relaxed">{portfolioImages[0].description}</p>
                    </ScrollReveal>
                  </div>
                </div>
                
                <div className="text-center mt-24 md:mt-32">
                  <Button variant="outline" onClick={() => { setShowFullPortfolio(true); setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 100) }} className="group relative border border-black text-black hover:text-white transition-all duration-700 px-16 py-6 text-sm uppercase tracking-[0.25em] bg-transparent overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-black/20 rounded-none">
                    <span className="relative z-10 flex items-center transition-transform duration-300">Explore All Projects</span>
                    <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="full" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto">
                {/* VERSION A: Tight spacing (gap-4), dim + caption overlay in center, NO zoom */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                  <AnimatePresence>
                    {portfolioImages.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ layout: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }, opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-stone-50 relative">
                          {item.type === "video" ? (
                            <video src={item.src} title={item.alt} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                          )}
                          {/* Dim overlay + centered caption */}
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                            <h3 className="text-xl md:text-2xl font-thin text-white tracking-wide text-center px-4">{item.title}</h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <div className="text-center mt-16">
                  <Button variant="outline" onClick={() => setShowFullPortfolio(false)} className="group relative border border-black text-black hover:text-white transition-all duration-700 px-16 py-6 text-sm uppercase tracking-[0.25em] bg-transparent overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-black/20 rounded-none">
                    <span className="relative z-10 flex items-center transition-transform duration-300">Back to Home</span>
                    <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <AnimatePresence>
        {!showFullPortfolio && (
          <>
            <motion.div key="carousel" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }} className="relative z-50 bg-white">
              <HorizontalScrollCarousel media={horizontalScrollMedia} />
            </motion.div>
            
            <motion.section key="about" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5, delay: 0.15 }} id="about" className="pt-20 md:pt-32 pb-0 bg-white relative overflow-hidden z-50">
              <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
                  <div className="md:w-1/4">
                    <div className="sticky top-32">
                      <h2 className="text-3xl md:text-4xl font-thin uppercase tracking-[0.2em] text-black mb-6">About</h2>
                      <div className="w-16 h-[1px] bg-black" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-[10px] md:text-xs font-light leading-relaxed tracking-wide text-stone-800 uppercase">
                        <span className="block mb-4">Mattie takes a bold approach to colour and expression.</span>
                        <span className="block mb-4">After studying make up at London College of Fashion in 2016, Mattie quickly became 1st assistant to leading London based Make Up Artist.</span>
                        <span className="block">She continues to use make up as expression in her own work, experimenting with shapes and textures as well as showcasing excellent skin work. Mattie is currently working with brands such as 16Arlington, Studio Nicholson, Burberry, Loewe and more.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

