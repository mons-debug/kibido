"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/lib/context/CartContext";

export default function FloatingCartButton() {
  const { cartCount, cartTotal } = useCart();
  const [showButton, setShowButton] = useState(false);
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  // Only show the button if there are items in the cart
  // and the user has scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (cartCount > 0) {
        setShowButton(window.scrollY > 300);
      } else {
        setShowButton(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cartCount]);
  
  // Also show button whenever cartCount changes (if not at top)
  useEffect(() => {
    if (cartCount > 0 && window.scrollY > 300) {
      setShowButton(true);
      
      // Hide after 5 seconds of inactivity if user doesn't scroll
      const timeout = setTimeout(() => {
        if (!document.documentElement.classList.contains('scrolling')) {
          setShowButton(false);
        }
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [cartCount]);
  
  if (cartCount === 0) return null;
  
  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="/cart">
            <motion.div 
              className="flex items-center gap-3 bg-white rounded-full pl-4 pr-5 py-3 shadow-lg border border-stone-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-brown-700" />
                <span className="absolute -top-2 -right-2 bg-brown-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="font-medium text-stone-900">${formatPrice(cartTotal)}</p>
                <p className="text-xs text-stone-500">View Cart</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 