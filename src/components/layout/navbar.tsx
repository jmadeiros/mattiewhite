"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Instagram } from "lucide-react"

// About is handled separately as a scroll action

interface NavbarProps {
  onPortfolioClick?: () => void
  variant?: "default" | "sticky" | "smart" | "minimal"
}

export function Navbar({ onPortfolioClick, variant = "default" }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Basic scrolled state (for background transparency)
      if (variant === "default") {
        // Old logic for reference, or just standard scroll
        setIsScrolled(currentScrollY > 50)
      } else {
        setIsScrolled(currentScrollY > 50)
      }

      // Smart navbar logic (hide on down, show on up)
      if (variant === "smart") {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false) // Scrolling down
        } else {
          setIsVisible(true) // Scrolling up
        }
        lastScrollY.current = currentScrollY
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [variant])

  const genericHamburgerLine = `h-[1.5px] w-5 my-[3px] rounded-full bg-stone-700 transition ease transform duration-300`

  // Base classes
  let navClasses = "fixed left-0 right-0 z-50 transition-all duration-500 "
  
  // Variant specific classes
  if (variant === "default") {
    navClasses += `top-0 ${isScrolled || isOpen ? "bg-white/90 shadow-sm backdrop-blur-sm translate-y-0 opacity-100" : "bg-transparent -translate-y-full opacity-0 pointer-events-none"}`
  } else if (variant === "sticky") {
    navClasses += `top-0 ${isScrolled || isOpen ? "bg-white/90 shadow-sm backdrop-blur-sm py-0" : "bg-transparent py-4"}`
  } else if (variant === "smart") {
    navClasses += `${isVisible ? "top-0 translate-y-0" : "-top-20 -translate-y-full"} ${isScrolled || isOpen ? "bg-white/90 shadow-sm backdrop-blur-sm py-0" : "bg-transparent py-4"}`
  } else if (variant === "minimal") {
    navClasses += `top-0 h-14 bg-white/95 backdrop-blur-md shadow-sm flex items-center`
  } else {
     // Fallback to "sticky" logic if default or unknown
     navClasses += `top-0 ${isScrolled || isOpen ? "bg-white/90 shadow-sm backdrop-blur-sm py-0" : "bg-transparent py-4"}`
  }

  // Inner container height adjustments
  const innerContainerClasses = (variant === "minimal" || variant === "sticky" || variant === "smart")
    ? "h-12 md:h-14" 
    : "h-16 md:h-20"

  return (
    <header className={navClasses}>
      <div className={`w-full px-4 md:px-6 flex items-center justify-between ${innerContainerClasses}`}>
        <Link
          href="#home"
          className="flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <img 
            src="/mattie+white+logos_off+white+1.webp" 
            alt="Mattie White" 
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7">
          <button
            onClick={() => {
              onPortfolioClick?.()
              document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors font-light tracking-wide"
          >
            Portfolio
          </button>
          <button
            onClick={() => {
              // Scroll to the end of horizontal carousel where About is
              const carousel = document.querySelector('section.relative.h-\\[400vh\\]')
              if (carousel) {
                const rect = carousel.getBoundingClientRect()
                const scrollTarget = window.scrollY + rect.top + rect.height - window.innerHeight
                window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
              }
            }}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors font-light tracking-wide"
          >
            About
          </button>
          <a
            href="mailto:mattie.white@icloud.com"
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors font-light tracking-wide"
          >
            Contact
          </a>
          <Link 
            href="https://www.instagram.com/mattiewhite_makeup/" 
            target="_blank" 
            aria-label="Instagram" 
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            <Instagram size={16} strokeWidth={1.5} />
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col h-10 w-10 justify-center items-center group relative z-50"
            aria-label="Open navigation menu"
          >
            <div className={`${genericHamburgerLine} ${isOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
            <div className={`${genericHamburgerLine} ${isOpen ? "opacity-0" : ""}`} />
            <div className={`${genericHamburgerLine} ${isOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-0 left-0 w-full min-h-screen bg-white/95 backdrop-blur-md pt-20 pb-10 flex flex-col items-center"
          onClick={(e) => {
            // Close if clicking on the background itself, not a link
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <nav className="flex flex-col items-center space-y-6">
            <button
              onClick={() => {
                onPortfolioClick?.()
                setIsOpen(false)
                setTimeout(() => {
                  document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }}
              className="text-lg text-stone-600 hover:text-stone-900 font-light"
            >
              Portfolio
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                setTimeout(() => {
                  const carousel = document.querySelector('section.relative.h-\\[400vh\\]')
                  if (carousel) {
                    const rect = carousel.getBoundingClientRect()
                    const scrollTarget = window.scrollY + rect.top + rect.height - window.innerHeight
                    window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
                  }
                }, 100)
              }}
              className="text-lg text-stone-600 hover:text-stone-900 font-light"
            >
              About
            </button>
            <a
              href="mailto:mattie.white@icloud.com"
              className="text-lg text-stone-600 hover:text-stone-900 font-light"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <Link 
              href="https://www.instagram.com/mattiewhite_makeup/" 
              target="_blank" 
              aria-label="Instagram" 
              className="text-stone-600 hover:text-stone-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Instagram size={20} strokeWidth={1.5} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
