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
  {
    src: "/images/carousel2/Beauty Adjacent : Benjamin Vnuk .jpg",
    alt: "Beauty Adjacent",
    title: "Beauty Adjacent",
    category: "Beauty Adjacent",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/Net A Porter .jpg",
    alt: "Net A Porter",
    title: "Net A Porter",
    category: "Commercial",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/IMG_9310 copy.jpg",
    alt: "Selfridges",
    title: "Selfridges",
    category: "Campaign",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/Beauty : Jack Grange .jpg",
    alt: "Beauty",
    title: "Beauty",
    category: "Beauty",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/BOSS.mp4",
    alt: "BOSS",
    title: "BOSS",
    category: "Commercial",
    type: "video" as "image" | "video",
  },
  {
    src: "/images/carousel2/Wallpaper Magazine .jpg",
    alt: "WallPaper Magazine",
    title: "WallPaper Magazine",
    category: "Editorial",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/Selfridges .mp4",
    alt: "Selfridges",
    title: "Selfridges",
    category: "Campaign",
    type: "video" as "image" | "video",
  },
  {
    src: "/images/carousel2/Olivia Petronella Palermo_LOVEWANT35 copy.jpg",
    alt: "Love Want",
    title: "Love Want",
    category: "Editorial",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/portfolio/cos-editorial.jpg",
    alt: "COS",
    title: "COS",
    category: "Editorial",
    type: "image" as "image" | "video",
  },
  {
    src: "/images/carousel2/0003303800_2_3_1.jpg",
    alt: "Zara",
    title: "Zara",
    category: "Commercial",
    type: "image" as "image" | "video",
  },
]

interface MainPageProps {
  navbarVariant?: "default" | "sticky" | "smart" | "minimal"
}

export default function MainPage({ navbarVariant = "smart" }: MainPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Images scroll up from below to center, hold, then scroll up and out
  // 0-0.35: Images scroll up SLOWLY from below to center
  // 0.35-0.55: Hold in center (reduced hold duration)
  // 0.55-1.0: Both logo and images scroll up and out of view
  const imagesY = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.55, 1.0], 
    ["100vh", "0vh", "0vh", "-100vh"]
  )
  const imagesOpacity = useTransform(scrollYProgress, [0, 0.20], [0, 1])
  
  // Logo scrolls up and out with images after hold period
  const logoY = useTransform(
    scrollYProgress, 
    [0, 0.55, 1.0], 
    ["0vh", "0vh", "-100vh"]
  )
  

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullPortfolio, setShowFullPortfolio] = useState(false)
  const [showInitialArrow, setShowInitialArrow] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Fast image cycling (180ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 180)
    return () => clearInterval(interval)
  }, [])

  // Show initial arrow after delay (4 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasScrolled) {
        setShowInitialArrow(true)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasScrolled])

  // Hide initial arrow when scrolling starts
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true)
        setShowInitialArrow(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-white text-black relative">
      
      <Navbar onPortfolioClick={() => {
        setShowFullPortfolio(true)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }} variant={navbarVariant} />
      
      <main className="flex-grow">
      {/* Hero Section - Only shown when not in full portfolio mode */}
      {!showFullPortfolio && (
        <section
          ref={heroRef}
          className="relative h-[400vh] w-full"
        >
          {/* MW Logo - Euclid Font Lockup */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 z-40 mix-blend-difference pointer-events-none select-none will-change-transform"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: logoY, translateY: "-50%" }}
          >
            <div className="flex font-euclid font-light text-white leading-none tracking-tight items-baseline">
              {/* M - normal */}
              <span className="text-[40vw] md:text-[28vw] block transform translate-y-[0.08em]">M</span>
              
              {/* W - mirrored M, perfectly aligned */}
              <span 
                className="text-[40vw] md:text-[28vw] block -ml-[10.6vw] md:-ml-[7.5vw]" 
                style={{ transform: 'scaleY(-1) translateY(-0.1em)' }}
              >
                M
                </span>
            </div>
          </motion.div>

          {/* Initial Arrow - appears below MW logo after delay, disappears on scroll */}
          <AnimatePresence>
            {showInitialArrow && !hasScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-2"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    className="text-stone-400"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cycling Images - Scroll up from below, hold, then scroll out */}
          <motion.div 
            className="fixed top-1/2 left-1/2 z-30 w-[75vw] md:w-[28vw] aspect-[3/4] shadow-2xl overflow-hidden bg-stone-200 will-change-transform"
            style={{
              x: "-50%",
              y: imagesY,
              opacity: imagesOpacity,
              translateY: "-50%",
            }}
          >
            {HERO_IMAGES.map((img, index) => (
              <img
                key={img}
                src={img || "/placeholder.svg"}
                alt={`Portfolio ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-none ${
                  index === currentImageIndex ? "opacity-100 block" : "opacity-0 hidden"
                }`}
                style={{ filter: "contrast(110%)" }}
              />
            ))}

            {/* Image Detail Overlay */}
            <div className="absolute -bottom-8 -left-8 hidden md:block z-20 mix-blend-difference text-white">
              <p className="font-serif text-4xl leading-tight italic">
                {currentImageIndex % 4 === 0 && "Mood"}
                {currentImageIndex % 4 === 1 && "Form"}
                {currentImageIndex % 4 === 2 && "Light"}
                {currentImageIndex % 4 === 3 && "Soul"}
              </p>
            </div>
          </motion.div>

        </section>
      )}
      
      {/* Portfolio Section */}
        <section id="portfolio" className="py-32 md:py-48 bg-white relative">
          <div className="container mx-auto px-8 md:px-16 lg:px-24">
          {/* Portfolio Title - With scroll fade animation */}
          <ScrollReveal>
            <div className="text-center mb-32 md:mb-48">
              <AnimatePresence mode="wait">
                {!showFullPortfolio ? (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-stone-600 max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase">
                      Selected Works
                    </h2>
                    <div className="w-32 h-[1px] bg-black mx-auto my-12" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-stone-600 max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase">
                      Portfolio
                    </h2>
                    <div className="w-32 h-[1px] bg-black mx-auto my-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
            <AnimatePresence mode="wait">
              {!showFullPortfolio ? (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-7xl mx-auto space-y-24 md:space-y-40"
                >
                {/* Portfolio Item 1 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                  <div className="md:col-span-7 group cursor-pointer">
                    <ScrollReveal>
                      <div className="aspect-[4/5] overflow-hidden bg-stone-50 relative">
                        {portfolioImages[0].type === "video" ? (
                          <video
                            src={portfolioImages[0].src}
                            title={portfolioImages[0].alt}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={portfolioImages[0].src || "/placeholder.svg"}
                            alt={portfolioImages[0].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>
                    </ScrollReveal>
                  </div>
                  <div className="md:col-span-5 text-right">
                    <ScrollReveal delay={0.2}>
                      <p className="text-sm text-stone-400 tracking-[0.2em] uppercase mb-4">
                        01 — {portfolioImages[0].category}
                      </p>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-black mb-6">
                        {portfolioImages[0].title}
                      </h3>
                      <p className="text-base text-stone-500 font-light leading-relaxed">{portfolioImages[0].description}</p>
                    </ScrollReveal>
                  </div>
                </div>
                {/* Portfolio Item 2 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                  <div className="md:col-span-5 text-left md:order-2">
                    <ScrollReveal delay={0.2}>
                      <p className="text-sm text-stone-400 tracking-[0.2em] uppercase mb-4">
                        02 — {portfolioImages[1].category}
                      </p>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-black mb-6">
                        {portfolioImages[1].title}
                      </h3>
                      <p className="text-base text-stone-500 font-light leading-relaxed">{portfolioImages[1].description}</p>
                    </ScrollReveal>
                  </div>
                  <div className="md:col-span-7 md:order-1 group cursor-pointer">
                    <ScrollReveal>
                      <div className="aspect-[16/9] overflow-hidden bg-stone-50 relative">
                        {portfolioImages[1].type === "video" ? (
                          <video
                            src={portfolioImages[1].src}
                            title={portfolioImages[1].alt}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover scale-[1.15] transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                          />
                        ) : (
                          <Image
                            src={portfolioImages[1].src || "/placeholder.svg"}
                            alt={portfolioImages[1].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
                {/* Portfolio Item 3 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                  <div className="md:col-span-7 group cursor-pointer">
                    <ScrollReveal>
                      <div className="aspect-[4/5] overflow-hidden bg-stone-50 relative">
                        {portfolioImages[3].type === "video" ? (
                          <video
                            src={portfolioImages[3].src}
                            title={portfolioImages[3].alt}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={portfolioImages[3].src || "/placeholder.svg"}
                            alt={portfolioImages[3].alt}
                            fill
                            className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
                          />
                        )}
                      </div>
                    </ScrollReveal>
                  </div>
                  <div className="md:col-span-5 text-right">
                    <ScrollReveal delay={0.2}>
                      <p className="text-sm text-stone-400 tracking-[0.2em] uppercase mb-4">
                        03 — {portfolioImages[3].category}
                      </p>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-black mb-6">
                        {portfolioImages[3].title}
                      </h3>
                      <p className="text-base text-stone-500 font-light leading-relaxed">{portfolioImages[3].description}</p>
                    </ScrollReveal>
                  </div>
                </div>
                  
                  {/* Explore All Projects Button */}
                  <div className="text-center mt-24 md:mt-32">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFullPortfolio(true)
                        // Scroll to top of portfolio section
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }, 100)
                      }}
                      className="group relative border border-black text-black hover:text-white transition-all duration-700 px-16 py-6 text-sm uppercase tracking-[0.25em] bg-transparent overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-black/20 rounded-none"
                    >
                      <span className="relative z-10 flex items-center transition-transform duration-300">
                        Explore All Projects
                      </span>
                      <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-7xl mx-auto"
                >
                  {/* Portfolio Grid - Tight spacing, no filters */}
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                  >
                    <AnimatePresence>
                      {portfolioImages.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            layout: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 }
                          }}
                          className="group cursor-pointer"
                        >
                        <div className="aspect-[3/4] overflow-hidden bg-stone-50 relative">
                          {item.type === "video" ? (
                            <video
                              src={item.src}
                              title={item.alt}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.src || "/placeholder.svg"}
                              alt={item.alt}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        {/* Caption below image - appears on hover */}
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-sm font-thin text-stone-600 tracking-wide text-center">{item.title}</h3>
                        </div>
                      </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Back Button */}
                  <div className="text-center mt-16">
                    <Button
                      variant="outline"
                      onClick={() => setShowFullPortfolio(false)}
                      className="group relative border border-black text-black hover:text-white transition-all duration-700 px-16 py-6 text-sm uppercase tracking-[0.25em] bg-transparent overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-black/20 rounded-none"
                    >
                      <span className="relative z-10 flex items-center transition-transform duration-300">
                        Back to Home
                      </span>
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
              <motion.div
                key="carousel"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                      className="relative z-50 bg-white"
              >
                <HorizontalScrollCarousel media={horizontalScrollMedia} />
              </motion.div>
              
              <motion.section
                key="about"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                id="about"
              className="pt-12 md:pt-20 pb-24 md:pb-32 bg-white relative overflow-hidden z-50"
              >
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
                  {/* Sticky Title */}
                  <div className="md:w-1/4">
                    <div className="sticky top-32">
                      <h2 className="text-3xl md:text-4xl font-thin uppercase tracking-[0.2em] text-black mb-6">
                          About
                        </h2>
                      <div className="w-16 h-[1px] bg-black" />
                    </div>
                  </div>
                        
                  {/* Content */}
                  <div className="md:w-3/4">
                        <div className="prose prose-lg max-w-none">
                      <p className="text-xs md:text-sm font-light leading-relaxed tracking-wide text-stone-800 uppercase">
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
