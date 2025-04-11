"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, ShoppingCart, Heart, Sparkles, Eye } from "lucide-react";

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
}

export default function HomePage() {
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [limitedOffers, setLimitedOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        
        const products = await response.json();
        
        // Ensure all product prices are numbers
        const processedProducts = products.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price)
        }));
        
        // Set hero products (first 5 featured products)
        setHeroProducts(processedProducts.filter((p: Product) => p.featured).slice(0, 5));
        
        // Set featured products
        setFeaturedProducts(processedProducts.filter((p: Product) => p.featured).slice(0, 8));
        
        // Set trending products (random selection)
        const shuffled = [...processedProducts].sort(() => 0.5 - Math.random());
        setTrendingProducts(shuffled.slice(0, 6));
        
        // Set limited offers (different selection)
        setLimitedOffers(shuffled.slice(6, 10));
        
        // Generate random view counts for social proof
        const views: Record<string, number> = {};
        processedProducts.forEach((product: Product) => {
          views[product.id] = Math.floor(Math.random() * 50) + 10;
        });
        setViewCounts(views);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
    
    // Auto-advance hero slider
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % (heroProducts.length || 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-[80vh] overflow-hidden">
        {heroProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {product.images[0] && (
              <div className="relative w-full h-full">
                <Image 
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <motion.div 
                  className="max-w-xl text-white"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: index === activeSlide ? 1 : 0, x: index === activeSlide ? 0 : -50 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
                  <p className="text-xl mb-6">{product.description}</p>
                  <p className="text-2xl font-semibold mb-8">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)} 
                    <span className="text-lg text-gray-300 ml-2">by {product.artist}</span>
                  </p>
                  <div className="flex gap-4">
                    <Link href={`/product/${product.id}`}>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium flex items-center gap-2"
                      >
                        View Details <ArrowRight size={16} />
                      </motion.button>
                    </Link>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-white text-white px-8 py-3 rounded-full font-medium flex items-center gap-2"
                    >
                      Add to Cart <ShoppingCart size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {heroProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full ${index === activeSlide ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="flex justify-between items-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Featured Collection</h2>
            <Link href="/products">
              <span className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                View all <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProducts.map(product => (
              <motion.div 
                key={product.id}
                className="group"
                variants={itemVariant}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
                    {product.images[0] && (
                      <Image 
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex justify-between items-center text-white">
                        <span className="font-medium">${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}</span>
                        <button className="bg-white text-gray-900 p-2 rounded-full">
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
                <div>
                  <h3 className="font-medium text-lg mb-1 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{product.category.name}</span>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {viewCounts[product.id] || 0} people viewing
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Limited Time Offers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">Limited Time Offers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss these exclusive art pieces available for a limited time. 
              Each piece is uniquely handcrafted by our talented artists.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {limitedOffers.map(product => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row"
                variants={itemVariant}
              >
                <div className="relative w-full md:w-2/5 aspect-square">
                  {product.images[0] && (
                    <Image 
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Limited Offer
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-xl font-bold">${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}</div>
                      <div className="text-gray-500 line-through">${typeof product.price === 'number' ? (product.price * 1.2).toFixed(2) : (Number(product.price) * 1.2).toFixed(2)}</div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">20% OFF</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium"
                      >
                        View Details
                      </motion.button>
                    </Link>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 border border-gray-300 rounded-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <p className="text-gray-600">Discover what art enthusiasts are loving right now</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {trendingProducts.map(product => (
              <motion.div 
                key={product.id}
                className="group"
                variants={itemVariant}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4">
                    {product.images[0] && (
                      <Image 
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium"
                      >
                        View Artwork
                      </motion.button>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {viewCounts[product.id] || 0} viewing
                    </div>
                  </div>
                </Link>
                <div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-gray-700 font-semibold">${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}</div>
                    <div className="text-gray-500">by {product.artist || 'Unknown Artist'}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial/Social Proof */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of art enthusiasts who have found their perfect piece at KibidouArt
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gray-800 p-6 rounded-xl"
              variants={itemVariant}
            >
              <div className="flex text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="mb-4">
                "The painting I purchased exceeded my expectations. The colors are vibrant and it's now the centerpiece of my living room. Shipping was fast and secure."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">Art Collector</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800 p-6 rounded-xl"
              variants={itemVariant}
            >
              <div className="flex text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="mb-4">
                "I'm absolutely in love with my new artwork. The artist captured exactly what I was looking for. The attention to detail is remarkable. Will definitely purchase again!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">Michael Zhang</div>
                  <div className="text-gray-400 text-sm">Interior Designer</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800 p-6 rounded-xl"
              variants={itemVariant}
            >
              <div className="flex text-amber-400 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5" />
              </div>
              <p className="mb-4">
                "KibidouArt offers a unique selection of handmade paintings you won't find anywhere else. I've purchased three pieces so far and each one has been stunning."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">Elena Rodriguez</div>
                  <div className="text-gray-400 text-sm">Art Enthusiast</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Find Your Perfect Piece Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Browse our exclusive collection of handmade paintings and transform your space with unique art
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium text-lg"
            >
              Explore All Artwork
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
