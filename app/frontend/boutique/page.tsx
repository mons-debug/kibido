'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Heart, 
  ShoppingCart, 
  Eye, 
  Search, 
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Filter,
  Trash2,
  X,
  Grid,
  LayoutList,
  Columns3,
  User,
  Flame,
  SearchX,
  RefreshCw,
  Tag,
  DollarSign,
  SortAsc,
  MessageCircle,
  Clock
} from 'lucide-react';
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
  latest: boolean;
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

export default function Boutique() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [whatsappNumber, setWhatsappNumber] = useState("+212000000000"); // Default WhatsApp number
  
  // UI state
  const [layoutView, setLayoutView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Refs for animations
  const heroRef = useRef(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Calculate total pages based on filtered products
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredProducts, itemsPerPage]);

  // Reset mobile filters visibility on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileFiltersOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Generate random view counts for social proof
        const views: Record<string, number> = {};
        productsData.forEach((product: Product) => {
          views[product.id] = Math.floor(Math.random() * 50) + 10;
        });
        setViewCounts(views);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, searchQuery, sortOption, products]);

  // Filter products based on selected filters
  const applyFilters = () => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by price range
    result = result.filter(
      product => 
        parseFloat(product.price) >= priceRange[0] && 
        parseFloat(product.price) <= priceRange[1]
    );

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.artist && product.artist.toLowerCase().includes(query))
      );
    }

    // Sort products
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // newest
        // In this case, we'll keep the original order as returned from API
        break;
    }

    setFilteredProducts(result);
  };

  // Price formatter
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // Get max price for range slider
  const getMaxPrice = () => {
    if (products.length === 0) return 50000;
    return Math.max(...products.map(p => parseFloat(p.price))) + 5000;
  };

  // Handle WhatsApp message
  const handleWhatsAppMessage = (product: Product) => {
    const message = `Bonjour, je suis intéressé(e) par cette œuvre d'art: ${product.name} (Prix: ${formatPrice(product.price)}). Pouvez-vous me donner plus d'informations?`;
    window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-50">
        <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full border-4 border-stone-200 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-brown-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-stone-700">Loading Boutique</h2>
        <p className="text-stone-500 mt-2">Discovering beautiful artworks for you...</p>
      </div>
    );
  }

  const maxPrice = getMaxPrice();

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-brown-900 text-white h-[50vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/30"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0.4 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-[url('/images/products/boutique.png')] bg-cover bg-center will-change-transform"
          style={{ scale: heroScale }}
        />
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-xl relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div 
                className="bg-stone-100/90 backdrop-blur-md p-8 rounded-xl shadow-xl will-change-transform"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
              >
                <motion.span 
                  className="inline-block px-3 py-1 bg-brown-100 text-brown-800 rounded-full text-sm font-semibold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  Kibidou Art Collection
                </motion.span>
          <motion.h1 
                  className="text-4xl md:text-5xl font-bold mb-4 text-stone-900"
                  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
          >
            Notre Boutique
          </motion.h1>
          <motion.p 
                  className="text-lg md:text-xl mb-6 text-stone-700"
                  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1 }}
          >
            Découvrez notre collection exceptionnelle d'œuvres d'art uniques créées par des artistes talentueux
          </motion.p>
          <motion.div
                  className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1 }}
          >
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 text-stone-800"
            />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
                </motion.div>
              </motion.div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden sticky top-0 z-30 bg-white shadow-md py-3 px-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full bg-brown-600 text-white py-2.5 rounded-md flex items-center justify-center gap-2"
        >
          <SlidersHorizontal size={18} />
          {isMobileFiltersOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
        </motion.button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters - Desktop version is sticky */}
          <motion.div 
            className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-1/4 bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-brown-500"></div>
                  <h2 className="text-2xl font-semibold">Filtres</h2>
                </div>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="lg:hidden p-1 hover:bg-stone-100 rounded-full"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </div>

              {/* Active Filters Summary */}
              {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < maxPrice || searchQuery || sortOption !== 'newest') && (
                <div className="mb-6 p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-600">Filtres actifs</span>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setPriceRange([0, maxPrice]);
                        setSearchQuery('');
                        setSortOption('newest');
                      }}
                      className="text-xs text-brown-600 hover:text-brown-800 underline"
                    >
                      Réinitialiser tout
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'all' && (
                      <span className="bg-brown-100 text-brown-800 px-2 py-1 rounded-full text-xs flex items-center">
                        {categories.find(c => c.id === selectedCategory)?.name || 'Catégorie'}
                        <button 
                          onClick={() => setSelectedCategory('all')}
                          className="ml-1 text-brown-600 hover:text-brown-800"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                    
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <span className="bg-brown-100 text-brown-800 px-2 py-1 rounded-full text-xs flex items-center">
                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        <button 
                          onClick={() => setPriceRange([0, maxPrice])}
                          className="ml-1 text-brown-600 hover:text-brown-800"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                    
                    {searchQuery && (
                      <span className="bg-brown-100 text-brown-800 px-2 py-1 rounded-full text-xs flex items-center">
                        {searchQuery}
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="ml-1 text-brown-600 hover:text-brown-800"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* Categories */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Tag size={16} className="mr-2 text-brown-600" />
                  Catégories
                </h3>
                <div className="space-y-2 pl-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                        className="h-4 w-4 text-brown-600 focus:ring-brown-500"
                    />
                      <label htmlFor="all" className="ml-2 text-stone-700 cursor-pointer">Toutes les catégories</label>
                  </div>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">{products.length}</span>
                </div>
                {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={category.id}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                          className="h-4 w-4 text-brown-600 focus:ring-brown-500"
                      />
                        <label htmlFor={category.id} className="ml-2 text-stone-700 cursor-pointer">{category.name}</label>
                    </div>
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">{category.productCount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <DollarSign size={16} className="mr-2 text-brown-600" />
                  Prix
                </h3>
                <div className="space-y-4 pl-2">
                <div className="flex justify-between">
                    <span className="text-stone-700 font-medium">{formatPrice(priceRange[0])}</span>
                    <span className="text-stone-700 font-medium">{formatPrice(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step={maxPrice / 50}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brown-600"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step={maxPrice / 50}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brown-600"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <SortAsc size={16} className="mr-2 text-brown-600" />
                  Trier par
                </h3>
                <div className="pl-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 text-stone-800"
              >
                <option value="newest">Plus récents</option>
                <option value="price-low">Prix: Croissant</option>
                <option value="price-high">Prix: Décroissant</option>
                <option value="name-asc">Nom: A-Z</option>
                <option value="name-desc">Nom: Z-A</option>
              </select>
                </div>
            </div>

            {/* Reset Filters */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, maxPrice]);
                setSearchQuery('');
                setSortOption('newest');
              }}
                className="w-full bg-brown-700 text-white py-2.5 px-4 rounded-md hover:bg-brown-800 transition duration-300 flex items-center justify-center gap-2"
            >
                Réinitialiser les filtres <RotateCcw size={16} />
              </motion.button>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Desktop Filter summary */}
            <motion.div 
              className="hidden lg:flex mb-6 p-4 bg-white rounded-lg shadow-md flex-wrap gap-2 items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mr-4">
                <Filter size={18} className="text-brown-600" />
                <span className="font-medium text-stone-700">Résultats: <span className="text-brown-700">{filteredProducts.length}</span></span>
              </div>
              
              <div className="flex-1 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                  <span className="bg-brown-100 text-brown-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Catégorie'}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                      className="ml-2 text-brown-600 hover:text-brown-800"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <span className="bg-brown-100 text-brown-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Prix: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <button 
                    onClick={() => setPriceRange([0, maxPrice])}
                      className="ml-2 text-brown-600 hover:text-brown-800"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {searchQuery && (
                  <span className="bg-brown-100 text-brown-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Recherche: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                      className="ml-2 text-brown-600 hover:text-brown-800"
                  >
                    &times;
                  </button>
                </span>
              )}
              
              {sortOption !== 'newest' && (
                  <span className="bg-brown-100 text-brown-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Tri: {
                    sortOption === 'price-low' ? 'Prix croissant' :
                    sortOption === 'price-high' ? 'Prix décroissant' :
                    sortOption === 'name-asc' ? 'Nom A-Z' :
                    'Nom Z-A'
                  }
                  <button 
                    onClick={() => setSortOption('newest')}
                      className="ml-2 text-brown-600 hover:text-brown-800"
                  >
                    &times;
                  </button>
                </span>
              )}
              </div>
              
              {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < maxPrice || searchQuery || sortOption !== 'newest') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, maxPrice]);
                    setSearchQuery('');
                    setSortOption('newest');
                  }}
                  className="text-sm text-brown-600 hover:text-brown-800 underline flex items-center gap-1"
                >
                  <Trash2 size={14} /> Effacer
                </button>
              )}
            </motion.div>

            {/* View options and results info */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-stone-600 flex items-center gap-2">
                <span className="hidden sm:inline-block">
                  Affichage de <span className="font-medium text-brown-700">{filteredProducts.length}</span> sur <span className="font-medium">{products.length}</span> produits
                </span>
                <span className="sm:hidden">
                  {filteredProducts.length}/{products.length} produits
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-stone-200">
                <motion.button
                  whileHover={{ backgroundColor: layoutView === 'grid' ? '#f3f4f6' : '#f8fafc' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayoutView('grid')}
                  className={`p-1.5 rounded ${layoutView === 'grid' ? 'bg-stone-100 text-brown-800' : 'text-stone-500'}`}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: layoutView === 'list' ? '#f3f4f6' : '#f8fafc' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayoutView('list')}
                  className={`p-1.5 rounded ${layoutView === 'list' ? 'bg-stone-100 text-brown-800' : 'text-stone-500'}`}
                  aria-label="List view"
                >
                  <LayoutList size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: layoutView === 'compact' ? '#f3f4f6' : '#f8fafc' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayoutView('compact')}
                  className={`p-1.5 rounded ${layoutView === 'compact' ? 'bg-stone-100 text-brown-800' : 'text-stone-500'}`}
                  aria-label="Compact view"
                >
                  <Columns3 size={18} />
                </motion.button>
              </div>
            </div>

            {/* Product Grid */}
            <motion.div 
              className={`
                ${layoutView === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : ''} 
                ${layoutView === 'list' ? 'flex flex-col gap-6' : ''}
                ${layoutView === 'compact' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : ''}
              `}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className={`
                      ${layoutView === 'grid' ? 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300' : ''} 
                      ${layoutView === 'list' ? 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row' : ''}
                      ${layoutView === 'compact' ? 'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300' : ''}
                    `}
                    variants={itemVariant}
                    custom={index}
                  >
                    <Link 
                      href={`/frontend/product/${product.slug}`} 
                      className={`${layoutView === 'list' ? 'flex flex-col sm:flex-row' : 'block'}`}
                    >
                      <div 
                        className={`
                          relative ${layoutView === 'grid' ? 'h-64' : ''} 
                          ${layoutView === 'list' ? 'sm:w-1/3 h-64 sm:h-auto' : ''}
                          ${layoutView === 'compact' ? 'h-48' : ''}
                          w-full bg-stone-100
                        `}
                      >
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
                                <Eye size={16} /> Voir détails
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500">
                            Image non disponible
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {product.featured && (
                            <div className="bg-amber-500 text-white px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 shadow-md">
                              <Sparkles size={12} /> Vedette
                            </div>
                          )}
                          
                          {product.latest && (
                            <div className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 shadow-md">
                              <Clock size={12} /> Nouveauté
                            </div>
                          )}
                          
                          {viewCounts[product.id] > 30 && (
                            <div className="bg-brown-600 text-white px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 shadow-md">
                              <Flame size={12} /> Populaire
                          </div>
                        )}
                        </div>
                        
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-md text-xs font-medium flex items-center z-10">
                          <Eye className="h-3 w-3 mr-1 text-brown-600" />
                          <span className="text-stone-800">{viewCounts[product.id] || 0}</span>
                        </div>
                      </div>
                      
                      <div className={`
                        p-4 flex flex-col 
                        ${layoutView === 'list' ? 'sm:w-2/3 sm:p-6' : ''} 
                        ${layoutView === 'compact' ? 'p-3' : ''}
                      `}>
                        <div className="flex justify-between items-start">
                          <h3 className={`
                            font-semibold text-stone-900 
                            ${layoutView === 'grid' ? 'text-lg mb-1 line-clamp-2' : ''}
                            ${layoutView === 'list' ? 'text-xl mb-2' : ''}
                            ${layoutView === 'compact' ? 'text-base mb-1 line-clamp-1' : ''}
                          `}>
                            {product.name}
                          </h3>
                          <span className={`
                            font-bold text-brown-700 
                            ${layoutView === 'grid' ? 'text-lg' : ''}
                            ${layoutView === 'list' ? 'text-xl' : ''}
                            ${layoutView === 'compact' ? 'text-base' : ''}
                          `}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 my-2">
                        {product.category && (
                            <span className="inline-block bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded">
                            {product.category.name}
                          </span>
                        )}
                          
                        {product.artist && (
                            <span className="inline-block bg-brown-50 text-brown-600 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <User size={10} /> {product.artist}
                            </span>
                          )}
                        </div>
                        
                        {layoutView !== 'compact' && (
                          <p className={`
                            text-stone-600 text-sm 
                            ${layoutView === 'grid' ? 'line-clamp-2 mb-4' : ''}
                            ${layoutView === 'list' ? 'line-clamp-3 mb-6' : ''}
                          `}>
                            {product.description}
                          </p>
                        )}
                        
                        <div className={`
                          mt-auto flex gap-2 
                          ${layoutView === 'compact' ? 'mt-2' : 'mt-4'}
                        `}>
                          {layoutView !== 'compact' ? (
                            <>
                              <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-brown-600 text-white py-2 rounded-md hover:bg-brown-700 transition duration-300 flex items-center justify-center gap-1"
                              >
                                Voir plus <ChevronRight size={16} />
                              </motion.button>
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
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 border border-stone-300 rounded-md bg-white hover:bg-green-50 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleWhatsAppMessage(product);
                                }}
                              >
                                <div className="w-5 h-5 flex items-center justify-center">
                                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                    <path d="M12 5.316c-3.685 0-6.685 2.998-6.685 6.684 0 1.261.35 2.439.958 3.44l-.696 2.55 2.651-.676c.955.528 2.046.839 3.213.839 3.684 0 6.684-2.999 6.684-6.685 0-3.684-3-6.684-6.684-6.684zm.011 1.493c2.84 0 5.153 2.312 5.153 5.153 0 2.841-2.313 5.153-5.153 5.153-1.107 0-2.134-.35-2.97-.944l-2.069.547.561-2.035c-.68-.878-1.085-1.981-1.085-3.175-.001-2.84 2.312-5.152 5.152-5.152z" />
                                  </svg>
                                </div>
                              </motion.button>
                            </>
                          ) : (
                            <div className="flex gap-2 w-full">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors"
                              >
                                <Heart className="h-4 w-4 text-brown-700" />
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
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 border border-stone-300 rounded-md bg-white hover:bg-green-50 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleWhatsAppMessage(product);
                                }}
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                    <path d="M12 5.316c-3.685 0-6.685 2.998-6.685 6.684 0 1.261.35 2.439.958 3.44l-.696 2.55 2.651-.676c.955.528 2.046.839 3.213.839 3.684 0 6.684-2.999 6.684-6.685 0-3.684-3-6.684-6.684-6.684zm.011 1.493c2.84 0 5.153 2.312 5.153 5.153 0 2.841-2.313 5.153-5.153 5.153-1.107 0-2.134-.35-2.97-.944l-2.069.547.561-2.035c-.68-.878-1.085-1.981-1.085-3.175-.001-2.84 2.312-5.152 5.152-5.152z" />
                                  </svg>
                                </div>
                              </motion.button>
                              <Link
                                href={`/frontend/product/${product.slug}`}
                                className="flex-1 bg-brown-600 text-white py-1.5 rounded-md hover:bg-brown-700 transition duration-300 flex items-center justify-center gap-1 text-sm"
                              >
                          Voir plus
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="col-span-full text-center py-12 bg-white rounded-lg shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <SearchX className="h-16 w-16 mx-auto text-stone-400 mb-4" />
                  <h3 className="text-xl font-medium text-stone-900">Aucun produit trouvé</h3>
                  <p className="mt-2 text-stone-600 max-w-md mx-auto">Essayez de modifier vos filtres pour voir plus de résultats.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, maxPrice]);
                      setSearchQuery('');
                      setSortOption('newest');
                    }}
                    className="mt-6 bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 transition duration-300 inline-flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Réinitialiser les filtres
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors text-stone-600 flex items-center gap-1"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft size={16} /> Précédent
                </motion.button>
                
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        currentPage === i + 1 
                          ? 'bg-brown-600 text-white' 
                          : 'border border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="text-stone-500">...</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-md flex items-center justify-center border border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </motion.button>
                    </>
              )}
            </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 border border-stone-300 rounded-md bg-white hover:bg-stone-50 transition-colors text-stone-600 flex items-center gap-1"
                  disabled={currentPage >= totalPages}
                >
                  Suivant <ChevronRight size={16} />
                </motion.button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
