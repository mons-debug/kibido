"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown,
  LogIn
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useCart } from "@/app/lib/context/CartContext";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  // Use cart context for cart count
  const { cartCount } = useCart();

  // Get current pathname
  const pathname = usePathname();

  // Update header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32">
              <Image 
                src="/images/logo/logo.png" 
                alt="Kibidou Art Collection" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-stone-800 hover:text-brown-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brown-600 after:opacity-0 hover:after:opacity-100 after:transition-opacity ${pathname === "/" ? "text-brown-800 after:opacity-100" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/frontend/collections" 
              className={`text-stone-800 hover:text-brown-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brown-600 after:opacity-0 hover:after:opacity-100 after:transition-opacity ${pathname?.includes("/collections") ? "text-brown-800 after:opacity-100" : ""}`}
            >
              Collections
            </Link>
            <Link 
              href="/frontend/boutique" 
              className={`text-stone-800 hover:text-brown-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brown-600 after:opacity-0 hover:after:opacity-100 after:transition-opacity ${pathname?.includes("/boutique") ? "text-brown-800 after:opacity-100" : ""}`}
            >
              Boutique
            </Link>
            <Link 
              href="/trending" 
              className="text-stone-800 hover:text-brown-700 font-medium transition-colors"
            >
              Trending
            </Link>
            <Link 
              href="/frontend/about" 
              className="text-stone-800 hover:text-brown-700 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/frontend/contact" 
              className="text-stone-800 hover:text-brown-700 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-stone-700 hover:text-brown-800 transition-colors relative">
              <Search size={20} />
            </button>
            <Link href="/wishlist" className="text-stone-700 hover:text-brown-800 transition-colors relative">
              <Heart size={20} />
            </Link>
            <Link href="/cart" className="text-stone-700 hover:text-brown-800 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brown-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-stone-800 hover:text-brown-700">
                  {session.user?.image ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200">
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={32} 
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User size={20} />
                  )}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white shadow-lg rounded-lg p-4 w-48 border border-stone-200">
                    <div className="border-b border-stone-200 pb-2 mb-2">
                      <p className="font-medium text-stone-900">{session.user?.name}</p>
                      <p className="text-sm text-stone-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/profile" className="block py-2 px-3 hover:bg-stone-100 rounded-md">Profile</Link>
                    <Link href="/orders" className="block py-2 px-3 hover:bg-stone-100 rounded-md">Orders</Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left py-2 px-3 hover:bg-stone-100 rounded-md text-rose-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => signIn()}
                className="flex items-center space-x-1 text-stone-800 hover:text-brown-700"
              >
                <LogIn size={20} />
                <span className="font-medium">Sign in</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/cart" className="text-stone-700 hover:text-brown-800 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brown-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-700 hover:text-brown-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-stone-200 absolute top-full left-0 right-0 shadow-lg"
          >
            <div className="container mx-auto px-6 py-6">
              <nav className="space-y-6">
                <Link 
                  href="/" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                <Link 
                  href="/frontend/collections" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collections
                </Link>

                <Link 
                  href="/frontend/boutique" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Boutique
                </Link>
                
                <Link 
                  href="/trending" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trending
                </Link>
                
                <Link 
                  href="/frontend/about" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                <Link 
                  href="/frontend/contact" 
                  className="block text-stone-800 hover:text-brown-700 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-stone-200">
                  <Link 
                    href="/wishlist" 
                    className="flex items-center space-x-2 text-stone-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart size={20} />
                    <span>Wishlist</span>
                  </Link>
                  
                  <div className="w-px h-6 bg-stone-200"></div>
                  
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement | null;
                      searchInput?.focus();
                    }}
                    className="flex items-center space-x-2 text-stone-700"
                  >
                    <Search size={20} />
                    <span>Search</span>
                  </button>
                </div>
                
                {session ? (
                  <div className="pt-4 border-t border-stone-200">
                    <div className="flex items-center space-x-3 mb-4">
                      {session.user?.image ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || "User"} 
                            width={40} 
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center">
                          <User size={20} className="text-brown-700" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-sm text-stone-500 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link 
                        href="/profile" 
                        className="block text-stone-700 hover:text-brown-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block text-stone-700 hover:text-brown-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <button 
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="text-rose-600"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-stone-200">
                    <button 
                      onClick={() => {
                        signIn();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-brown-700 font-medium"
                    >
                      <LogIn size={20} />
                      <span>Sign in</span>
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 