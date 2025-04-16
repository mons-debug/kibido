'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, ArrowLeft, Star, Eye, Palette, ShoppingCart } from 'lucide-react';
import AddToCart from '@/app/components/product/AddToCart';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  gallery: string[];
  stock: number;
  slug: string;
  categoryId: string;
  artist: string | null;
  featured: boolean;
  latest: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetail() {
  const params = useParams();
  const { slug } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        
        // Set the first image as selected
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        
        // Fetch related products from the same category
        fetchRelatedProducts(data.categoryId);
        
        // Generate a random view count for social proof
        setViewCount(Math.floor(Math.random() * 50) + 10);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Produit introuvable. Veuillez réessayer.');
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchRelatedProducts = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/products?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      const data = await response.json();
      
      // Filter out the current product and limit to 3 related products
      const filtered = data
        .filter((p: Product) => p.slug !== slug)
        .slice(0, 3);
      
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Price formatter
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex justify-center items-center py-20">
        <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full border-4 border-stone-200 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-brown-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-stone-700">Chargement de l'œuvre...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-stone-800">Œuvre introuvable</h1>
        <p className="mb-8 text-stone-600 max-w-md">{error || "Cette œuvre d'art n'existe pas ou a été retirée de notre collection."}</p>
        <Link 
          href="/frontend/boutique" 
          className="bg-brown-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-brown-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(product.images || []),
    ...(product.gallery || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-50 py-16 relative">
      <div className="absolute -left-40 top-20 w-80 h-80 bg-brown-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute -right-40 bottom-20 w-80 h-80 bg-amber-100 rounded-full opacity-40 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex mb-10 text-sm items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-stone-600 hover:text-brown-700 transition-colors">Accueil</Link>
          <ChevronRight size={14} className="mx-2 text-stone-400" />
          <Link href="/frontend/boutique" className="text-stone-600 hover:text-brown-700 transition-colors">Boutique</Link>
          <ChevronRight size={14} className="mx-2 text-stone-400" />
          <span className="text-brown-800 font-medium">{product.name}</span>
        </motion.nav>

        {/* Product Details Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-16 border border-stone-200"
          variants={scaleUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Product Images Section */}
            <div className="lg:w-[55%] p-6 lg:p-10 bg-stone-50">
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square w-full mb-4 bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-500">
                    Image non disponible
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-brown-600 text-white px-3 py-1 text-xs font-medium rounded-md">
                    Œuvre en vedette
                  </div>
                )}
                {product.latest && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 text-xs font-medium rounded-md" style={{left: product.featured ? '120px' : '4px'}}>
                    Nouveauté
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium flex items-center shadow-sm">
                  <Eye size={14} className="mr-2 text-brown-600" />
                  <span className="text-stone-800">{viewCount} personnes regardent</span>
                </div>
              </motion.div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {allImages.map((image, index) => (
                    <motion.div 
                      key={index}
                      className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === image ? 'border-brown-600 shadow-md' : 'border-stone-200 hover:border-brown-300'
                      }`}
                      onClick={() => setSelectedImage(image)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - vue ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="lg:w-[45%] p-6 lg:p-10 flex flex-col border-t lg:border-t-0 lg:border-l border-stone-200">
              <motion.div
                className="space-y-6"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {product.category && (
                  <div className="mb-2">
                    <span className="inline-block bg-brown-100 text-brown-800 text-xs px-3 py-1 rounded-full font-medium">
                      {product.category.name}
                    </span>
                  </div>
                )}
                
                <h1 className="text-3xl lg:text-4xl font-bold text-stone-900">{product.name}</h1>
                
                <div className="flex items-center border-b border-stone-100 pb-6">
                  <span className="text-3xl font-bold text-brown-800">
                    {formatPrice(product.price)}
                  </span>
                  {product.stock > 0 ? (
                    <span className="ml-4 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      En stock ({product.stock})
                    </span>
                  ) : (
                    <span className="ml-4 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Rupture de stock
                    </span>
                  )}
                </div>

                {product.artist && (
                  <div className="flex items-center gap-3 py-4 border-b border-stone-100">
                    <div className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center">
                      <Palette size={18} className="text-brown-700" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Artiste</p>
                      <p className="font-medium text-stone-900">{product.artist}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-stone-900">Description</h3>
                  <p className="text-stone-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  {product.stock > 0 ? (
                    <AddToCart
                      product={{
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price),
                        image: product.images[0] || '',
                        artist: product.artist || undefined
                      }}
                      className="flex-1 rounded-lg px-5 py-3 transition-colors"
                    />
                  ) : (
                    <motion.button
                      className="flex-1 bg-stone-300 cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
                      disabled
                    >
                      <ShoppingCart size={18} />
                      Rupture de stock
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(120, 53, 15, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-brown-700 text-brown-700 hover:bg-brown-50 py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart size={18} />
                    Ajouter aux favoris
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-3 border-t border-stone-100 pt-6 mt-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-stone-600 text-sm">42 avis clients</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Product Features */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-stone-900">Caractéristiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-stone-900">Certificat d'authenticité</h3>
              <p className="text-stone-600">Chaque œuvre est accompagnée d'un certificat d'authenticité signé par l'artiste.</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-stone-900">Emballage premium</h3>
              <p className="text-stone-600">Livraison dans un emballage sécurisé spécialement conçu pour protéger votre œuvre.</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-stone-900">Paiement sécurisé</h3>
              <p className="text-stone-600">Paiement 100% sécurisé avec options multiples incluant la carte bancaire et PayPal.</p>
          </div>
        </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-stone-900">Œuvres similaires</h2>
              <Link href="/frontend/boutique" className="text-brown-700 hover:text-brown-900 transition-colors flex items-center gap-1 font-medium">
                Voir plus <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <Link href={`/frontend/product/${relatedProduct.slug}`}>
                    <div className="relative aspect-square bg-stone-50">
                      {relatedProduct.images && relatedProduct.images[0] && (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain p-4"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-stone-900 mb-2">{relatedProduct.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-brown-800">
                          {formatPrice(relatedProduct.price)}
                        </div>
                        <div className="text-stone-500 text-sm">
                          par {relatedProduct.artist || 'Artiste inconnu'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 