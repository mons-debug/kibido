'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

// Collection data with images and descriptions
const COLLECTION_DATA = {
  'abstract': {
    title: 'Abstract Collection',
    description: 'Bold expressions and contemporary forms for modern spaces',
    image: '/images/products/collection2.png',
  },
  'moroccan': {
    title: 'Moroccan Collection',
    description: 'Traditional patterns and vibrant colors inspired by Moroccan design',
    image: '/images/products/collection1.png',
  },
  'minimalist': {
    title: 'Minimalist Collection',
    description: 'Clean lines and subtle colors for refined, elegant spaces',
    image: '/images/products/slideshow1.png',
  },
  'nature': {
    title: 'Nature Collection',
    description: 'Breathtaking landscapes and natural elements for tranquil spaces',
    image: '/images/products/slideshow2.png',
  }
};

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-50">
        <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full border-4 border-stone-200 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-brown-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-stone-700">Loading Collections</h2>
        <p className="text-stone-500 mt-2">Discovering beautiful collections for you...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-brown-900 text-white h-[40vh] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[url('/images/products/boutique-banner.jpg')] bg-cover bg-center" />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl relative">
              <div className="bg-stone-100/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
                <span className="inline-block px-3 py-1 bg-brown-100 text-brown-800 rounded-full text-sm font-semibold mb-4">
                  Kibidou Art Collection
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-stone-900">
                  Our Collections
                </h1>
                <p className="text-lg md:text-xl mb-6 text-stone-700">
                  Explore our curated collections of exceptional artwork for every taste and space
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => {
            const collectionData = COLLECTION_DATA[category.slug as keyof typeof COLLECTION_DATA] || {
              title: category.name,
              description: `Explore our ${category.name} collection of artworks`,
              image: '/images/products/boutique-banner.jpg'
            };
            
            return (
              <motion.div 
                key={category.id}
                className="relative overflow-hidden rounded-2xl aspect-[16/9] group"
                variants={itemVariant}
              >
                <Link href={`/frontend/collections/${category.slug}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <Image 
                    src={collectionData.image}
                    alt={collectionData.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{collectionData.title}</h3>
                    <p className="text-white/80 mb-4">{collectionData.description}</p>
                    <div className="flex items-center justify-between">
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white/20 backdrop-blur-sm border border-white/40 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 w-fit transition-colors hover:bg-white/30"
                      >
                        Explore Collection <ArrowRight size={16} />
                      </motion.button>
                      
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                        {category.productCount} artwork{category.productCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
} 