'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, ShoppingCart, Eye, ArrowLeft } from 'lucide-react';
import AddToCart from '@/app/components/product/AddToCart';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  stock: number;
  slug: string;
  categoryId: string;
  artist: string | null;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

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
    heroTitle: 'Abstract Art Collection',
    heroDescription: 'Discover our selection of abstract artwork that adds a contemporary and bold statement to any space'
  },
  'moroccan': {
    title: 'Moroccan Collection',
    description: 'Traditional patterns and vibrant colors inspired by Moroccan design',
    image: '/images/products/collection1.png',
    heroTitle: 'Moroccan Art Collection',
    heroDescription: 'Explore the vibrancy and rich cultural heritage of Moroccan-inspired artwork'
  },
  'minimalist': {
    title: 'Minimalist Collection',
    description: 'Clean lines and subtle colors for refined, elegant spaces',
    image: '/images/products/slideshow1.png',
    heroTitle: 'Minimalist Art Collection',
    heroDescription: 'Explore our carefully curated minimalist art that brings elegance through simplicity'
  },
  'nature': {
    title: 'Nature Collection',
    description: 'Breathtaking landscapes and natural elements for tranquil spaces',
    image: '/images/products/slideshow2.png',
    heroTitle: 'Nature Art Collection',
    heroDescription: 'Bring the beauty of the natural world into your space with our collection of nature-inspired art'
  }
};

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Get collection data
  const collectionData = COLLECTION_DATA[slug as keyof typeof COLLECTION_DATA] || {
    title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection',
    description: 'Explore our collection of artworks',
    image: '/images/products/boutique-banner.jpg',
    heroTitle: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) + ' Collection' : 'Collection',
    heroDescription: 'Explore our collection of exceptional artwork'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category by slug to get the ID
        const categoryResponse = await fetch('/api/categories');
        const categoriesData = await categoryResponse.json();
        const selectedCategory = categoriesData.find((cat: Category) => cat.slug === slug);
        
        if (selectedCategory) {
          setCategory(selectedCategory);
          
          // Fetch products by category ID
          const productsResponse = await fetch(`/api/products?categoryId=${selectedCategory.id}`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
          
          // Generate random view counts for social proof
          const views: Record<string, number> = {};
          productsData.forEach((product: Product) => {
            views[product.id] = Math.floor(Math.random() * 50) + 10;
          });
          setViewCounts(views);
        } else {
          // Category not found
          setProducts([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Price formatter
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-50">
        <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full border-4 border-stone-200 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-brown-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-stone-700">Loading Collection</h2>
        <p className="text-stone-500 mt-2">Discovering beautiful artworks for you...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-brown-900 text-white h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${collectionData.image})` }}
        />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl relative">
              <div className="bg-stone-100/90 backdrop-blur-md p-8 rounded-xl shadow-xl">
                <Link 
                  href="/frontend/collections" 
                  className="inline-flex items-center text-brown-700 hover:text-brown-900 mb-4 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to Collections
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-stone-900">
                  {collectionData.heroTitle}
                </h1>
                <p className="text-lg md:text-xl mb-6 text-stone-700">
                  {collectionData.heroDescription}
                </p>
                {category && (
                  <div className="bg-brown-100 text-brown-800 inline-block px-3 py-1 rounded-full text-sm font-medium">
                    {category.productCount} artwork{category.productCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">No Artworks Found</h2>
            <p className="text-stone-600 mb-6">We couldn't find any artworks in this collection.</p>
            <Link
              href="/frontend/boutique"
              className="inline-block bg-brown-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors"
            >
              Explore All Artworks
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Artworks in this Collection</h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  variants={itemVariant}
                  custom={index}
                >
                  <Link href={`/frontend/product/${product.slug}`}>
                    <div className="relative h-64 w-full bg-stone-100">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative w-full h-full group">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg text-brown-800 font-medium flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <Eye size={16} /> View details
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-500">
                          Image not available
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md text-xs font-medium flex items-center z-10">
                        <Eye className="h-3 w-3 mr-1 text-brown-600" />
                        <span className="text-stone-800">{viewCounts[product.id] || 0}</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <Link href={`/frontend/product/${product.slug}`} className="hover:underline">
                        <h3 className="font-semibold text-stone-900 text-lg mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="font-bold text-brown-700 text-lg">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    {product.artist && (
                      <span className="inline-block bg-brown-50 text-brown-600 text-xs px-2 py-0.5 rounded mb-2">
                        Artist: {product.artist}
                      </span>
                    )}
                    
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/frontend/product/${product.slug}`}
                        className="flex-1 bg-brown-600 text-white py-2 rounded-md hover:bg-brown-700 transition duration-300 flex items-center justify-center gap-1"
                      >
                        View more <ChevronRight size={16} />
                      </Link>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors"
                      >
                        <Heart className="h-5 w-5 text-brown-700" />
                      </motion.button>
                      <AddToCart
                        product={{
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price),
                          image: product.images[0] || '',
                          artist: product.artist || undefined
                        }}
                        className="p-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
        
        <div className="mt-12 text-center">
          <Link
            href="/frontend/boutique"
            className="inline-block bg-brown-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors"
          >
            Explore All Artworks
          </Link>
        </div>
      </div>
    </div>
  );
} 