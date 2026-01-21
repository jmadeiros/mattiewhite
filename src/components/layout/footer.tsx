import Link from "next/link"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-stone-100 py-6 md:py-8">
      <div className="w-full px-4 md:px-6">
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

          {/* Right: Email Button & Socials */}
          <div className="flex items-center gap-6 pr-2 md:pr-6 lg:pr-20">
            <a
              href="mailto:mattie.white@icloud.com"
              className="group relative border border-stone-400 text-stone-600 hover:text-white hover:border-black transition-all duration-500 px-8 py-3 text-[10px] uppercase tracking-[0.2em] bg-transparent overflow-hidden rounded-full"
            >
              <span className="relative z-10">Get in Touch</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </a>

            <Link href="https://www.instagram.com/mattiewhite_makeup/" target="_blank" aria-label="Instagram" className="text-stone-500 hover:text-black transition-colors">
              <Instagram size={18} strokeWidth={1.5} />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
