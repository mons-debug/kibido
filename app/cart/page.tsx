"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Trash2, 
  MinusCircle, 
  PlusCircle, 
  ArrowLeft, 
  ShoppingCart,
  MessageCircle
} from "lucide-react";
import { useCart } from "@/app/lib/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState("+212000000000"); // Replace with your WhatsApp number
  const [loading, setLoading] = useState(false);

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Prepare WhatsApp message with order details
  const prepareWhatsAppMessage = () => {
    // Construct the message with each item's details
    let message = "Hello, I would like to order the following items:\n\n";
    
    cartItems.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - $${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `\nSubtotal: $${formatPrice(cartTotal)}`;
    message += "\n\nPlease let me know the payment details and delivery options.";
    
    return encodeURIComponent(message);
  };

  // Checkout via WhatsApp
  const checkoutViaWhatsApp = () => {
    setLoading(true);
    try {
      const message = prepareWhatsAppMessage();
      window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`, '_blank');
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-brown-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-stone-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Your Cart</h1>
          <Link 
            href="/frontend/boutique" 
            className="flex items-center text-brown-700 hover:text-brown-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-stone-100 rounded-full mb-4">
              <ShoppingCart size={32} className="text-stone-500" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Your cart is empty</h2>
            <p className="text-stone-600 mb-6">Looks like you haven't added any artwork to your cart yet.</p>
            <Link 
              href="/frontend/boutique"
              className="inline-block px-6 py-3 bg-brown-700 text-white rounded-lg font-medium hover:bg-brown-800 transition-colors"
            >
              Explore Artworks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-lg font-semibold text-stone-900">Cart Items ({cartItems.length})</h2>
                </div>
                
                <div>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      className="p-6 border-b border-stone-100 flex flex-col sm:flex-row gap-4"
                      variants={itemVariants}
                    >
                      <div className="relative w-24 h-24 bg-stone-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-stone-900">{item.name}</h3>
                            {item.artist && (
                              <p className="text-sm text-stone-600">By {item.artist}</p>
                            )}
                          </div>
                          <p className="font-semibold text-stone-900">${formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-4">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-stone-400 hover:text-stone-600"
                              disabled={item.quantity <= 1}
                            >
                              <MinusCircle size={20} />
                            </button>
                            <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-stone-400 hover:text-stone-600"
                            >
                              <PlusCircle size={20} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <p className="text-sm text-stone-600">
                              Subtotal: <span className="font-medium">${formatPrice(item.price * item.quantity)}</span>
                            </p>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-rose-500 hover:text-rose-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div>
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-28"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <p className="text-stone-600">Subtotal</p>
                      <p className="font-medium text-stone-900">${formatPrice(cartTotal)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-stone-600">Shipping & Handling</p>
                      <p className="text-stone-900">Contact us</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-stone-600">Tax</p>
                      <p className="text-stone-900">Based on location</p>
                    </div>
                    <div className="pt-4 border-t border-stone-200 flex justify-between">
                      <p className="font-medium text-stone-900">Total</p>
                      <p className="font-bold text-lg text-stone-900">${formatPrice(cartTotal)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <motion.button
                      onClick={checkoutViaWhatsApp}
                      className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Checkout via WhatsApp
                    </motion.button>
                    
                    <p className="text-sm text-stone-500 text-center">
                      Click the button above to continue your checkout via WhatsApp. We'll process your order and discuss payment and delivery options.
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-stone-200">
                    <h3 className="font-medium text-stone-900 mb-3">How it works</h3>
                    <ol className="space-y-3 text-sm text-stone-600">
                      <li className="flex gap-2">
                        <span className="bg-brown-100 text-brown-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 font-medium">1</span>
                        <span>Click the "Checkout via WhatsApp" button</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-brown-100 text-brown-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 font-medium">2</span>
                        <span>Confirm your order details in WhatsApp</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-brown-100 text-brown-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 font-medium">3</span>
                        <span>Our team will discuss payment options and shipping</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-brown-100 text-brown-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 font-medium">4</span>
                        <span>Complete payment and wait for your beautiful artwork!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 