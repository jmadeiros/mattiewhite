export type PortfolioItem = {
  id: number
  src: string
  alt: string
  title: string
  category: string
  description: string
  type: "image" | "video"
}

export const portfolioImages: PortfolioItem[] = [
  {
    id: 1,
    src: "/images/portfolio/cover-vogue.jpg",
    alt: "Vogue Türkiye cover shoot with dramatic eye makeup",
    title: "Vogue Türkiye Cover",
    category: "Editorial",
    description: "A cover shoot for Vogue Türkiye, focusing on bold, graphic liner and flawless skin.",
    type: "image",
  },
  {
    id: 2,
    src: "/images/portfolio/chromatic-study.jpg",
    alt: "Model with chromatic and glossy makeup",
    title: "Chromatic Study",
    category: "Avant-Garde",
    description: "An experimental look exploring the interplay of light, color, and texture on the skin.",
    type: "image",
  },
  {
    id: 3,
    src: "/videos/portfolio-video-2.mp4",
    alt: "Model with dynamic makeup",
    title: "Dynamic Beauty",
    category: "Motion",
    type: "video",
    description: "A captivating motion piece showcasing dynamic makeup artistry.",
  },
  {
    id: 4,
    src: "/images/portfolio/lovewant-georgia.jpg",
    alt: "Olivia Palermo with a soft glam makeup look",
    title: "Ethereal Glow",
    category: "Celebrity",
    type: "image",
    description: "A collaboration featuring soft, luminous makeup that enhances natural beauty.",
  },
  {
    id: 5,
    src: "/images/portfolio/submission-beauty.jpg",
    alt: "Creative makeup with abstract shapes on model's face",
    title: "Abstract Forms",
    category: "Creative",
    type: "image",
    description: "Pushing the boundaries of beauty with geometric patterns and bold artistic expression.",
  },
  {
    id: 6,
    src: "/images/portfolio/editorial-outdoor.jpg",
    alt: "Close-up beauty shot of a model with glossy skin",
    title: "Glass Skin",
    category: "Beauty",
    type: "image",
    description: "Achieving the perfect dewy, translucent finish for an editorial beauty shoot.",
  },
  {
    id: 7,
    src: "/images/portfolio/scarlet-kiss.jpg",
    alt: "Close-up of bold red lips",
    title: "Scarlet Kiss",
    category: "Beauty",
    type: "image",
    description: "Classic beauty with a focus on the perfect red lip and minimal makeup.",
  },
  {
    id: 8,
    src: "/images/portfolio/net-a-porter.jpg",
    alt: "Elegant editorial makeup for Net-A-Porter",
    title: "Net-A-Porter Editorial",
    category: "Editorial",
    type: "image",
    description: "Sophisticated editorial work for Net-A-Porter featuring refined, high-fashion makeup.",
  },
]

export const categories = ["All", "Editorial", "Beauty", "Avant-Garde", "Motion", "Celebrity", "Creative"]


