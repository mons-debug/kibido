"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Search, 
  ArrowRight, 
  ShoppingCart, 
  Heart, 
  ArrowUpRight,
  Play,
  Palette,
  Eye,
  ShoppingBag,
  MessageCircle,
  Bookmark,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

// Product type definition
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  artist: string | null;
  category: {
    name: string;
  };
  featured: boolean;
  latest: boolean;  // Add the latest flag
}

export default function HomePage() {
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);  // New state for latest products
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [whatsappNumber, setWhatsappNumber] = useState("+212000000000"); // Default WhatsApp number
  
  // Static hero slides data
  const heroSlides = [
    {
      id: "slide1",
      image: "/images/products/slideshow1.png",
      name: "Luxury Art Collection",
      description: "Discover our exclusive collection of handcrafted artworks that bring elegance and character to your space.",
      price: 29990,
      artist: "Premium Artists"
    },
    {
      id: "slide2",
      image: "/images/products/slideshow2.png",
      name: "Moroccan Masterpieces",
      description: "Authentic Moroccan art created with traditional techniques and modern inspiration.",
      price: 18990,
      artist: "Moroccan Artisans"
    },
    {
      id: "slide4",
      image: "/images/products/Your-Scene-2-scaled-e1736177317804.jpg",
      name: "Modern Living Art",
      description: "Transform your living space with vibrant, contemporary artworks that make a bold statement.",
      price: 21990,
      artist: "Contemporary Artists"
    }
  ];
  
  // Refs for scroll animations
  const featuredRef = useRef(null);
  const trendingRef = useRef(null);
  const testimonialsRef = useRef(null);
  const heroRef = useRef(null);

  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  
  // Check if sections are in view
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.3 });
  const trendingInView = useInView(trendingRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
  const heroInView = useInView(heroRef, { once: true, amount: 0.1 });

  // Fetch products
    const fetchProducts = async () => {
      try {
      setLoading(true);
      
      // Fetch products separately: all products and latest products
      const [allProductsResponse, latestProductsResponse] = await Promise.all([
        fetch("/api/products", {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }),
        fetch("/api/products?latest=true&limit=4", {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
      ]);
      
      if (!allProductsResponse.ok || !latestProductsResponse.ok) {
        throw new Error(`Failed to fetch products`);
      }
      
      const allProducts = await allProductsResponse.json();
      const latestProductsData = await latestProductsResponse.json();
        
      const processedProducts = allProducts.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price)
        }));
        
      const processedLatestProducts = latestProductsData.map((product: Product) => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price)
      }));
      
        setFeaturedProducts(processedProducts.filter((p: Product) => p.featured).slice(0, 8));
      setTrendingProducts(processedProducts.slice(0, 6));
      setLimitedOffers(processedProducts.slice(6, 10));
      setLatestProducts(processedLatestProducts); // Set the latest products from dedicated API call
      
        const views: Record<string, number> = {};
        processedProducts.forEach((product: Product) => {
          views[product.id] = Math.floor(Math.random() * 50) + 10;
        });
        setViewCounts(views);
        
      } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        setLoading(false);
      }
    };

  // Enhanced initialization effect
  useEffect(() => {
    fetchProducts();
    
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Optimized animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleInOut = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Handle WhatsApp message
  const handleWhatsAppMessage = (product: Product) => {
    const message = `Bonjour, je suis intéressé(e) par cette œuvre d'art: ${product.name} (Prix: ${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)} MAD). Pouvez-vous me donner plus d'informations?`;
    window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-screen bg-stone-50"
      >
        <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full border-4 border-stone-200 rounded-full"></div>
          <motion.div 
            className="absolute w-full h-full border-4 border-t-brown-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
      </div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-xl font-medium text-stone-700"
        >
          Loading KibidouArt
        </motion.h2>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] md:h-[90vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        
        <AnimatePresence mode="sync" initial={false}>
          {heroSlides.map((slide, index) => (
            index === activeSlide && (
              <motion.div 
                key={slide.id} 
                className="absolute inset-0"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <motion.div 
                  className="relative w-full h-full will-change-transform"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                >
                <Image 
                    src={slide.image}
                    alt={slide.name}
                    fill
                    className={`object-cover ${
                      slide.image.includes('Your-Scene-2') 
                        ? 'object-[center_75%]'
                        : 'object-center'
                    }`}
                    priority
                    sizes="(max-width: 768px) 100vw, 100vw"
                    quality={90}
                    loading="eager"
                  />
                </motion.div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Preload next slide images to avoid flicker */}
        <div className="hidden">
          {heroSlides.map((slide, index) => (
            index !== activeSlide && (
              <Image 
                key={`preload-${slide.id}`}
                src={slide.image}
                alt="Preload"
                width={1}
                height={1}
                priority
              />
            )
          ))}
        </div>
            
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
                <motion.div 
              className="max-w-xl relative z-30 mx-auto sm:mx-0"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {/* Desktop Card */}
              <motion.div 
                className="relative backdrop-blur-[2px] bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-2xl hidden sm:block"
                variants={scaleInOut}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  duration: 0.8
                }}
                style={{
                  width: "clamp(300px, 90vw, 580px)",
                  transform: "translateZ(0)"
                }}
              >
                <motion.div 
                  className="h-1 bg-gradient-to-r from-amber-500/70 via-brown-600/70 to-stone-800/70"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                ></motion.div>
                
                <div className="p-4 sm:p-6 md:p-8 relative">
                  <motion.span 
                    className="inline-block px-3 py-1 bg-brown-600/40 text-amber-50 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 backdrop-blur-sm text-shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Kibidou Art Collection
                  </motion.span>
                  
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h1 
                      key={`title-${activeSlide}`}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white min-h-[60px] sm:min-h-[72px] leading-tight text-shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {heroSlides[activeSlide]?.name}
                    </motion.h1>
                  </AnimatePresence>
                  
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p 
                      key={`desc-${activeSlide}`}
                      className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white min-h-[60px] sm:min-h-[84px] leading-relaxed line-clamp-3 sm:line-clamp-none text-shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {heroSlides[activeSlide]?.description}
                    </motion.p>
                  </AnimatePresence>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/frontend/boutique" className="w-full sm:w-auto">
                      <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: '#78350f' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto bg-brown-700/80 text-white px-5 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg group backdrop-blur-sm"
                      >
                        Explore Boutique <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                    
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div 
                        key={`artist-${activeSlide}`}
                        className="flex items-baseline gap-2 text-amber-200"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-xs uppercase tracking-wider text-shadow-sm">Artist</span>
                        <span className="text-white text-sm font-medium text-shadow-sm">{heroSlides[activeSlide]?.artist}</span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>

              {/* Mobile Optimized Card */}
              <motion.div 
                className="sm:hidden w-full backdrop-blur-none"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col h-[80vh] justify-end pb-20">
                  <motion.div
                    key={`mobile-content-${activeSlide}`}
                    className="bg-gradient-to-b from-black/15 to-black/30 backdrop-blur-[2px] rounded-2xl overflow-hidden shadow-xl mx-4 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="h-1 bg-gradient-to-r from-amber-500/60 via-brown-600/60 to-stone-800/60"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-brown-600/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Palette className="h-4 w-4 text-amber-100" />
                        </div>
                        <span className="text-amber-100 text-xs font-medium text-shadow-sm">Kibidou Art Collection</span>
                      </div>
                      
                      <h1 className="text-3xl font-bold text-white text-shadow-lg mb-3 leading-tight">
                        {heroSlides[activeSlide]?.name}
                      </h1>
                      
                      <p className="text-sm text-white mb-5 line-clamp-2 leading-relaxed text-shadow-sm">
                        {heroSlides[activeSlide]?.description}
                      </p>
                      
                      <div className="flex flex-row items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-amber-300" />
                          </div>
                          <span className="text-amber-200 text-xs font-medium text-shadow-sm">{heroSlides[activeSlide]?.artist}</span>
                        </div>
                        
                        <Link href="/frontend/boutique">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-brown-700/70 to-amber-700/70 text-white rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm"
                    >
                            Explore <ArrowRight size={12} />
                    </motion.button>
                        </Link>
                      </div>
                  </div>
                </motion.div>
              </div>
              </motion.div>
                </motion.div>
            </div>
          </div>

        {/* Mobile-friendly slider navigation */}
        <motion.div 
          className="absolute bottom-12 sm:bottom-10 left-0 right-0 z-30 flex justify-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-8 sm:w-12 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'bg-brown-600 w-12 sm:w-16' : 'bg-white/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
        
        {/* Mobile arrow navigation - Hidden on mobile */}
        <div className="absolute top-1/2 left-0 right-0 z-30 hidden sm:flex justify-between px-2 sm:px-6 -translate-y-1/2 pointer-events-none">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
            }}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide(prev => (prev + 1) % heroSlides.length);
            }}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Add text shadow utilities for better readability with low opacity backgrounds */}
        <style jsx global>{`
          .text-shadow-lg {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
          }
          .text-shadow-sm {
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </section>

      {/* Featured Collection - Horizontal Carousel */}
      <motion.section 
        ref={featuredRef}
        className="py-10 sm:py-16 bg-white relative overflow-hidden"
        variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brown-50 rounded-full opacity-30 blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brown-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div className="mb-8 sm:mb-12 relative" variants={fadeInUp}>
            <motion.div 
              className="w-16 sm:w-20 h-1 bg-brown-500 mb-4 sm:mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
            viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8">
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2 sm:mb-3">
                  Featured Collection
                </h2>
                <p className="text-sm sm:text-base text-stone-600 max-w-2xl">
                  Explore our handpicked selection of exceptional artworks that showcase the finest craftsmanship and artistic vision.
                </p>
              </motion.div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <motion.button
                  id="prev-collection"
                  className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-brown-100 hover:text-brown-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous collection"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  id="next-collection"
                  className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-brown-100 hover:text-brown-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next collection"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Collection Grid/Carousel */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            {/* Desktop Grid View */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-6">
              {/* Moroccan Collection */}
              <motion.div 
                className="relative overflow-hidden rounded-2xl aspect-[4/5] group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/frontend/collections/moroccan">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 group-hover:via-black/10 transition-all duration-300" />
                  <Image 
                    src="/images/products/IMG_4094-scaled.jpg"
                    alt="Moroccan Collection"
                    fill
                    sizes="(max-width: 1024px) 50vw, 40vw"
                    className="object-cover brightness-110 transition-all duration-700 group-hover:scale-105 group-hover:brightness-125"
                    priority
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/10">
                      <span className="text-amber-400 text-sm font-medium mb-2 block">Featured Collection</span>
                      <h3 className="text-2xl font-bold text-white mb-3">Moroccan Collection</h3>
                      <p className="text-sm text-white/90 mb-4 line-clamp-2">Traditional patterns and vibrant colors inspired by Moroccan design heritage.</p>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit transition-colors hover:bg-white/30"
                      >
                        Explore <ArrowRight size={14} />
                      </motion.div>
                    </div>
                  </div>
            </Link>
          </motion.div>
          
              {/* Abstract Collection */}
          <motion.div 
                className="relative overflow-hidden rounded-2xl aspect-[4/5] group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/frontend/collections/abstract">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 group-hover:via-black/10 transition-all duration-300" />
                  <Image 
                    src="/images/products/slidesnew-02-scaled.jpg"
                    alt="Abstract Collection"
                    fill
                    sizes="(max-width: 1024px) 50vw, 40vw"
                    className="object-cover object-center brightness-110 transition-all duration-700 group-hover:scale-105 group-hover:brightness-125"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/10">
                      <span className="text-amber-400 text-sm font-medium mb-2 block">New Arrivals</span>
                      <h3 className="text-2xl font-bold text-white mb-3">Abstract Collection</h3>
                      <p className="text-sm text-white/90 mb-4 line-clamp-2">Vibrant expressions and contemporary portraits that capture the essence of modern art.</p>
              <motion.div 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit transition-colors hover:bg-white/30"
                      >
                        Explore <ArrowRight size={14} />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Carousel View */}
            <div className="sm:hidden">
              <div className="overflow-hidden -mx-4 px-4">
                <motion.div 
                  className="flex gap-4 transition-transform duration-500 ease-out"
                  drag="x"
                  dragConstraints={{ left: -800, right: 0 }}
                  dragElastic={0.2}
                  id="collection-carousel"
                >
                  {/* Moroccan Collection - Mobile */}
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl min-w-[85%] aspect-[4/5] group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/frontend/collections/moroccan">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <Image 
                        src="/images/products/IMG_4094-scaled.jpg"
                        alt="Moroccan Collection"
                        fill
                        sizes="85vw"
                        className="object-cover brightness-110"
                        priority
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4">
                          <span className="text-amber-400 text-xs font-medium mb-1 block">Featured Collection</span>
                          <h3 className="text-lg font-bold text-white mb-2">Moroccan Collection</h3>
                          <p className="text-sm text-white/90 mb-3 line-clamp-2">Traditional patterns and vibrant colors inspired by Moroccan design heritage.</p>
                          <div className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 w-fit">
                            Explore <ArrowRight size={14} />
                    </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  {/* Abstract Collection - Mobile */}
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl min-w-[85%] aspect-[4/5] group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/frontend/collections/abstract">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <Image 
                        src="/images/products/slidesnew-02-scaled.jpg"
                        alt="Abstract Collection"
                        fill
                        sizes="85vw"
                        className="object-cover object-center brightness-110"
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4">
                          <span className="text-amber-400 text-xs font-medium mb-1 block">New Arrivals</span>
                          <h3 className="text-lg font-bold text-white mb-2">Abstract Collection</h3>
                          <p className="text-sm text-white/90 mb-3 line-clamp-2">Vibrant expressions and contemporary portraits that capture the essence of modern art.</p>
                          <div className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 w-fit">
                            Explore <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
                  </motion.div>

                  {/* Modern Collection - Mobile Only */}
                  <motion.div 
                    className="relative overflow-hidden rounded-2xl min-w-[85%] aspect-[4/5] group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/frontend/collections/modern">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <Image 
                        src="/images/products/73e83ebd-29d3-42d7-bef2-574fb106d377.jpeg"
                        alt="Modern Collection"
                        fill
                        sizes="85vw"
                        className="object-cover brightness-110"
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4">
                          <span className="text-amber-400 text-xs font-medium mb-1 block">Popular Choice</span>
                          <h3 className="text-lg font-bold text-white mb-2">Modern Collection</h3>
                          <p className="text-sm text-white/90 mb-3 line-clamp-2">Bold and expressive artworks that push the boundaries of contemporary art.</p>
                          <div className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 w-fit">
                            Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Mobile Navigation Elements */}
              <div className="flex justify-center gap-2 mt-6">
                <button className="w-8 h-1.5 rounded-full bg-brown-600" aria-label="Go to slide 1"></button>
                <button className="w-3 h-1.5 rounded-full bg-stone-300 hover:bg-brown-300 transition-colors" aria-label="Go to slide 2"></button>
                <button className="w-3 h-1.5 rounded-full bg-stone-300 hover:bg-brown-300 transition-colors" aria-label="Go to slide 3"></button>
              </div>

              {/* Mobile Navigation Arrows */}
              <div className="absolute top-1/2 left-0 right-0 z-30 flex justify-between px-2 -translate-y-1/2">
                <motion.button
                  onClick={() => {
                    const carousel = document.getElementById('collection-carousel');
                    if (carousel) {
                      carousel.scrollBy({ left: -300, behavior: 'smooth' });
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 opacity-70 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  onClick={() => {
                    const carousel = document.getElementById('collection-carousel');
                    if (carousel) {
                      carousel.scrollBy({ left: 300, behavior: 'smooth' });
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 opacity-70 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
                </div>
              </motion.div>

          {/* View All Collections Button */}
          <motion.div
            className="text-center mt-10 sm:mt-12"
            variants={fadeInUp}
          >
            <Link href="/frontend/collections" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#292524' }}
                whileTap={{ scale: 0.97 }}
                className="bg-stone-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-medium flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto"
              >
                <span>View All Collections</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Add JavaScript for carousel functionality */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.getElementById('collection-carousel');
            const prevBtn = document.getElementById('prev-collection');
            const nextBtn = document.getElementById('next-collection');
            
            if (carousel && prevBtn && nextBtn) {
              let currentIndex = 0;
              const items = carousel.children;
              const itemWidth = items[0]?.offsetWidth + 16; // width + gap
              
              prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                  currentIndex--;
                  updateCarousel();
                }
              });
              
              nextBtn.addEventListener('click', () => {
                if (currentIndex < items.length - 1) {
                  currentIndex++;
                  updateCarousel();
                }
              });
              
              function updateCarousel() {
                carousel.style.transform = \`translateX(\${-currentIndex * itemWidth}px)\`;
              }
              
              // Touch swipe functionality
              let touchStartX = 0;
              let touchEndX = 0;
              
              carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
              });
              
              carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
              });
              
              function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold && currentIndex < items.length - 1) {
                  // Swipe left -> next
                  currentIndex++;
                  updateCarousel();
                }
                if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
                  // Swipe right -> previous
                  currentIndex--;
                  updateCarousel();
                }
              }
            }
          });
        `
      }} />

      {/* Featured Artists - Split Card Design */}
      <section className="py-16 bg-stone-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-40 top-20 w-96 h-96 bg-brown-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -right-40 bottom-20 w-96 h-96 bg-amber-100 rounded-full opacity-30 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Featured Artists</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Meet the talented artists behind our exclusive collections, each bringing their unique vision and techniques to create stunning artworks.
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Split Card Design */}
              <motion.div 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                {/* Messari Artist Side */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 h-full">
                    <div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden">
                    <Image 
                        src="/images/products/IMG_4094-scaled.jpg"
                        alt="Messari Artwork"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-brown-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
                          <Palette className="h-3.5 w-3.5" /> Featured Artist
                  </div>
                </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                  <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                            <Sparkles className="h-5 w-5" />
                    </div>
                          <h3 className="text-xl font-bold text-stone-900">Messari</h3>
                  </div>
                  
                        <p className="text-sm text-stone-600 mb-6 line-clamp-3">Moroccan-inspired artwork featuring traditional patterns and cultural heritage symbols with modern techniques.</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center">
                              <Palette className="h-4 w-4 text-brown-700" />
                            </div>
                            <span className="text-xs text-stone-600">Moroccan Style</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center">
                              <Eye className="h-4 w-4 text-brown-700" />
                            </div>
                            <span className="text-xs text-stone-600">24 artworks</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/frontend/artist/messari" className="block w-full z-10 relative">
                      <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-4 px-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-xl shadow-lg border border-amber-400 z-10 relative mt-2"
                        >
                          View Profile <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </motion.button>
                    </Link>
                    </div>
                  </div>
                </div>

                {/* Axel Artist Side */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 h-full">
                    <div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden">
                      <Image 
                        src="/images/products/slidethumbnail-scaled.jpg"
                        alt="Axel Artwork"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-brown-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg">
                          <Palette className="h-3.5 w-3.5" /> Featured Artist
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <h3 className="text-xl font-bold text-stone-900">Axel</h3>
                        </div>
                        
                        <p className="text-sm text-stone-600 mb-6 line-clamp-3">Vibrant abstract expressions featuring bold colors and contemporary portraits that capture modern artistic movements.</p>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center">
                              <Palette className="h-4 w-4 text-brown-700" />
                            </div>
                            <span className="text-xs text-stone-600">Abstract Style</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center">
                              <Eye className="h-4 w-4 text-brown-700" />
                            </div>
                            <span className="text-xs text-stone-600">18 artworks</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/frontend/artist/axel" className="block w-full z-10 relative">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                          className="w-full py-4 px-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-xl shadow-lg border border-amber-400 z-10 relative mt-2"
                    >
                          View Profile <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                      </Link>
                    </div>
                  </div>
                  </div>
                </div>
              </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Artworks Section */}
      <section className="py-10 sm:py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div 
            className="mb-8 sm:mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="w-16 sm:w-20 h-1 bg-brown-500 mb-4 sm:mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2 sm:mb-3">Latest Artworks</h2>
                <p className="text-sm sm:text-base text-stone-600 max-w-2xl">
                  Discover our newest additions of unique artworks from talented artists around the world.
                </p>
            </div>
              <Link href="/frontend/boutique">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-brown-700 font-medium hover:text-brown-900 text-sm sm:text-base mt-3 md:mt-0"
                >
                  View All Artworks <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          {/* Product Grid - Mobile Optimized with Horizontal Scroll */}
          <motion.div 
            className="relative -mx-4 sm:-mx-6 sm:mx-0"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="overflow-hidden px-4 sm:px-6">
              <motion.div 
                id="latest-products-carousel"
                className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 transition-transform duration-500 ease-out"
                drag="x"
                dragConstraints={{ left: -1100, right: 0 }}
                dragElastic={0.2}
              >
                {latestProducts.length > 0 ? (
                  latestProducts.map((product) => (
              <motion.div 
                key={product.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 min-w-[85%] sm:min-w-0"
                      variants={fadeInUp}
              >
                      <div className="relative aspect-[4/3] overflow-hidden">
                      <Image 
                          src={product.images[0] || "/placeholder-image.jpg"}
                        alt={product.name}
                        fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-amber-500/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          Latest
                        </div>
                        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                          <Eye size={12} className="sm:hidden" />
                          <Eye size={14} className="hidden sm:block" />
                          <span className="text-xs sm:text-sm font-medium">{viewCounts[product.id] || 0} people</span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="sm:hidden text-amber-500 fill-amber-500" />
                            <Star size={14} className="hidden sm:block text-amber-500 fill-amber-500" />
                            <span className="text-xs sm:text-sm font-medium">5.0</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brown-100 flex items-center justify-center">
                            <Palette size={12} className="sm:hidden text-brown-700" />
                            <Palette size={14} className="hidden sm:block text-brown-700" />
                          </div>
                          <span className="text-xs sm:text-sm text-stone-600">by {product.artist || "Kibidou"}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg sm:text-2xl font-bold text-stone-900">{product.price.toLocaleString()} MAD</span>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                            className="p-1.5 sm:p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
                      >
                            <Heart size={16} className="sm:hidden text-stone-600" />
                            <Heart size={18} className="hidden sm:block text-stone-600" />
                      </motion.button>
                    </div>
                        <div className="flex gap-2">
                          <Link 
                            href={`/frontend/product/${product.id}`}
                            className="flex-1 bg-brown-600 text-white py-2.5 rounded-lg hover:bg-brown-700 transition duration-300 flex items-center justify-center gap-1 text-sm font-medium shadow-md"
                          >
                            View Product <ChevronRight size={14} />
                          </Link>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-amber-500 hover:bg-amber-600 rounded-lg shadow-md transition-all duration-300 border border-amber-400"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart className="h-5 w-5 text-white" />
                          </motion.button>
                    </div>
                  </div>
                    </motion.div>
                  ))
                ) : (
                  // Placeholder content if no latest products are available
                  Array.from({ length: 4 }).map((_, index) => (
                    <motion.div 
                      key={`placeholder-${index}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 min-w-[85%] sm:min-w-0"
                      variants={fadeInUp}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 animate-pulse">
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="w-3/4 h-6 bg-stone-200 rounded animate-pulse mb-4"></div>
                        <div className="w-1/2 h-4 bg-stone-200 rounded animate-pulse mb-6"></div>
                        <div className="w-1/3 h-8 bg-stone-200 rounded animate-pulse mb-4"></div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-10 bg-stone-200 rounded animate-pulse"></div>
                          <div className="w-10 h-10 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
                  ))
                )}
          </motion.div>
            </div>

            {/* Mobile Carousel Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6 sm:hidden">
              <button className="w-8 h-1.5 rounded-full bg-brown-600" aria-label="Go to slide 1"></button>
              <button className="w-3 h-1.5 rounded-full bg-stone-300 hover:bg-brown-300 transition-colors" aria-label="Go to slide 2"></button>
              <button className="w-3 h-1.5 rounded-full bg-stone-300 hover:bg-brown-300 transition-colors" aria-label="Go to slide 3"></button>
            </div>
          </motion.div>

          {/* Add JavaScript for carousel functionality */}
          <script dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const latestProductsCarousel = document.getElementById('latest-products-carousel');
                
                if (latestProductsCarousel) {
                  let touchStartX = 0;
                  let touchEndX = 0;
                  
                  latestProductsCarousel.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                  });
                  
                  latestProductsCarousel.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                  });
                  
                  function handleSwipe() {
                    const swipeThreshold = 50;
                    const scrollAmount = 300;
                    
                    if (touchEndX < touchStartX - swipeThreshold) {
                      // Swipe left -> next
                      latestProductsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                    if (touchEndX > touchStartX + swipeThreshold) {
                      // Swipe right -> previous
                      latestProductsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    }
                  }
                }
              });
            `
          }} />
        </div>
      </section>

      {/* About Us Section - Mobile Optimized */}
      <section className="py-10 sm:py-16 bg-stone-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brown-50 rounded-full opacity-30 blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brown-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
            {/* Image collage - Mobile Optimized */}
          <motion.div 
              className="w-full lg:w-1/2 relative order-2 lg:order-1 mt-8 lg:mt-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative max-w-md mx-auto lg:mx-0">
                <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
                  <Image 
                    src="/images/products/f45ab71e-4395-4dd1-9b9b-c7ca82904477.jpeg" 
                    alt="Artist at work"
                    fill
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl transform translate-y-6 sm:translate-y-8">
                  <Image 
                    src="/images/products/2a4bc75b-9eea-4fc4-b690-ac40a3c4871e.jpeg" 
                    alt="Studio space"
                    fill
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 sm:-bottom-8 left-1/4 right-1/4 aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white">
                  <Image 
                    src="/images/products/73e83ebd-29d3-42d7-bef2-574fb106d377.jpeg" 
                    alt="Finished artwork"
                    fill
                    sizes="(max-width: 1024px) 30vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
          </motion.div>
          
            {/* Text content - Mobile Optimized */}
          <motion.div 
              className="w-full lg:w-1/2 order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-16 sm:w-20 h-1 bg-brown-500 mb-4 sm:mb-6"
              ></motion.div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-4 sm:mb-6">The Art of Kibidou</h2>
              
              <p className="text-sm sm:text-base md:text-lg text-stone-700 mb-4 sm:mb-6 leading-relaxed">
                Founded in 2018, Kibidou Art Collection was born from a passion for connecting talented artists with art enthusiasts around the world. Our curated gallery features exclusive handcrafted artworks that bring elegance and character to any space.
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-stone-700 mb-6 sm:mb-8 leading-relaxed">
                We work directly with over 100 artists from diverse cultural backgrounds, ensuring that each piece tells a unique story. Our commitment to authenticity and craftsmanship means every artwork in our collection is one-of-a-kind.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brown-100 flex items-center justify-center">
                    <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-brown-700" />
                  </div>
                <div>
                    <h4 className="font-semibold text-stone-900 text-sm sm:text-base">Original Art</h4>
                    <p className="text-stone-600 text-xs sm:text-sm">100% handcrafted</p>
                </div>
              </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brown-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brown-700" />
              </div>
                <div>
                    <h4 className="font-semibold text-stone-900 text-sm sm:text-base">Certified</h4>
                    <p className="text-stone-600 text-xs sm:text-sm">Authenticity guaranteed</p>
                </div>
              </div>
              </div>
              
              <Link href="/about">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-2.5 sm:py-3 px-6 sm:px-8 bg-brown-700 text-white rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 w-fit hover:bg-brown-800 transition-colors"
                >
                  Our Story <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof */}
      <motion.section 
        ref={testimonialsRef}
        className="py-16 bg-white text-stone-800 relative overflow-hidden"
        variants={staggerChildren}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="absolute -left-40 top-0 w-80 h-80 bg-stone-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -right-40 bottom-0 w-96 h-96 bg-stone-50 rounded-full opacity-40 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
            <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">What Our Collectors Say</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Join thousands of art enthusiasts who have found their perfect piece at KibidouArt
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerChildren}
          >
            {[
              {
                text: "The painting I purchased exceeded my expectations. The colors are vibrant and it's now the centerpiece of my living room. Shipping was fast and secure.",
                name: "Sarah Johnson",
                role: "Art Collector",
                initials: "SJ"
              },
              {
                text: "I'm absolutely in love with my new artwork. The artist captured exactly what I was looking for. The attention to detail is remarkable. Will definitely purchase again!",
                name: "Michael Zhang",
                role: "Interior Designer",
                initials: "MZ"
              },
              {
                text: "KibidouArt offers a unique selection of handmade paintings you won't find anywhere else. I've purchased three pieces so far and each one has been stunning.",
                name: "Elena Rodriguez",
                role: "Art Enthusiast",
                initials: "ER"
              }
            ].map((testimonial, index) => (
            <motion.div 
                key={index}
                className="bg-stone-50 p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-stone-700 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center pt-4 border-t border-stone-200">
                  <div className="w-12 h-12 bg-brown-600 rounded-full mr-4 flex items-center justify-center text-xl font-bold text-white">
                    {testimonial.initials}
              </div>
                <div>
                    <div className="font-medium text-lg text-stone-800">{testimonial.name}</div>
                    <div className="text-stone-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action - Mobile Optimized */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-brown-800 to-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/products/slidee.jpg"
            alt="Background Art"
            fill
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brown-900/40 via-black/50 to-black/60"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Find Your Perfect Piece Today
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-stone-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Browse our exclusive collection of handmade paintings and transform your space with unique art that speaks to your soul
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/products" className="w-full sm:w-auto">
            <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto bg-white text-stone-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-medium shadow-xl hover:shadow-brown-700/20 hover:bg-stone-100 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Explore All Artwork <ArrowRight size={18} className="hidden sm:inline" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto border-2 border-white/80 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Learn About Our Artists
            </motion.button>
            </motion.div>
            
            <motion.div 
              className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-white/20 flex flex-wrap justify-center gap-4 sm:gap-8 text-stone-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm">100+ Original Artists</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm">Free Worldwide Shipping</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
