"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real implementation, you would call an API to handle the subscription
      console.log(`Subscribing email: ${email}`);
      setSubscribed(true);
      setEmail("");
      
      // Reset the subscribed state after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="relative h-12 w-36">
                <Image 
                  src="/images/logo/logo.png" 
                  alt="Kibidou Art Collection" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-stone-300 mb-6 max-w-md">
              Discover handcrafted artworks from talented artists around the world. 
              Our curated collection brings elegance and character to your space.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brown-700 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brown-700 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brown-700 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-brown-700 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/collections" className="text-stone-300 hover:text-brown-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-stone-300 hover:text-brown-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-stone-300 hover:text-brown-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-300 hover:text-brown-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-stone-300 hover:text-brown-400 transition-colors flex items-center">
                  <ArrowRight size={14} className="mr-2" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-brown-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-stone-300">
                  123 Art Gallery Street<br />
                  New York, NY 10001<br />
                  United States
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-brown-400 mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-stone-300 hover:text-brown-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-brown-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@kibidou.com" className="text-stone-300 hover:text-brown-400 transition-colors">
                  info@kibidou.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-stone-300 mb-4">
              Subscribe to receive updates on new arrivals, special offers and exclusive events.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-stone-800 text-white rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-brown-500 placeholder-stone-500"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brown-600 rounded-md p-2 hover:bg-brown-700 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
            {subscribed && (
              <p className="text-brown-400 mt-2 text-sm">
                Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-stone-700 pt-10 pb-8">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/visa.svg" alt="Visa" width={40} height={25} />
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={40} height={25} />
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/amex.svg" alt="American Express" width={40} height={25} />
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/paypal.svg" alt="PayPal" width={40} height={25} />
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/apple-pay.svg" alt="Apple Pay" width={40} height={25} />
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded">
              <Image src="/images/payment/google-pay.svg" alt="Google Pay" width={40} height={25} />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-700 pt-8 text-center">
          <p className="text-stone-400 text-sm">
            &copy; {currentYear} Kibidou Art Collection. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-stone-400">
            <Link href="/terms" className="hover:text-brown-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-brown-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/shipping" className="hover:text-brown-400 transition-colors">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-brown-400 transition-colors">
              Returns & Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 