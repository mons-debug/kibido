"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/app/lib/context/CartContext";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    artist?: string;
  };
  className?: string;
}

export default function AddToCart({ product, className = "" }: AddToCartProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // Determine if this is being used as an icon-only button based on className
  const isIconOnly = className.includes("p-2") || className.includes("p-1");
  
  const handleAddToCart = () => {
    addToCart(product);
    
    // Show "Added" feedback
    setIsAdded(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  return (
    <motion.button
      onClick={handleAddToCart}
      className={`${isIconOnly ? '' : 'flex items-center justify-center gap-2 bg-brown-700 hover:bg-brown-800 text-white font-medium'} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className={`${isIconOnly ? 'h-5 w-5 text-green-600' : 'h-5 w-5'}`} />
          {!isIconOnly && "Added to Cart"}
        </>
      ) : (
        <>
          <ShoppingCart className={`${isIconOnly ? 'h-5 w-5 text-brown-700' : 'h-5 w-5'}`} />
          {!isIconOnly && "Add to Cart"}
        </>
      )}
    </motion.button>
  );
} 