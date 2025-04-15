"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  ArrowRight
} from "lucide-react";

export default function ContactPage() {
  // Form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  
  // Refs for scroll animations
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const faqRef = useRef(null);
  
  // Check if sections are in view
  const formInView = useInView(formRef, { once: true, amount: 0.3 });
  const mapInView = useInView(mapRef, { once: true, amount: 0.3 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 });
  
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
  
  // Form handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you'd send this data to your backend
    console.log(formState);
    // Show success message
    setSubmitted(true);
    // Reset form
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };
  
  // FAQ data
  const faqItems = [
    {
      question: "How do I purchase art from KibidouArt?",
      answer: "You can browse our collection online and purchase directly through our website. Simply select the artwork you love, add it to your cart, and proceed to checkout. We accept major credit cards and PayPal for your convenience."
    },
    {
      question: "What is your shipping policy?",
      answer: "We offer worldwide shipping on all our artworks. Standard shipping typically takes 5-10 business days within the US and 10-15 business days internationally. All artworks are carefully packaged to ensure they arrive in perfect condition."
    },
    {
      question: "Can I return or exchange my purchase?",
      answer: "We want you to be completely satisfied with your purchase. If you're not happy with your artwork, you can return it within 30 days of receipt. The artwork must be in its original condition and packaging. Please contact us to initiate a return."
    },
    {
      question: "Do you offer custom commissions?",
      answer: "Yes, many of our artists accept custom commissions. If you're interested in a custom piece, please contact us with your requirements and we'll connect you with the appropriate artist to discuss your vision."
    },
    {
      question: "How do I care for my artwork?",
      answer: "For paintings, avoid direct sunlight and high humidity. Dust with a soft, dry cloth. For sculptures and three-dimensional works, dust regularly and handle with clean hands. Each artwork comes with specific care instructions."
    }
  ];
  
  // Contact info
  const contactInfo = {
    address: "123 Art Gallery Street, New York, NY 10001, United States",
    email: "info@kibidouart.com",
    phone: "+1 (234) 567-890",
    hours: [
      { days: "Monday - Friday", time: "10:00 AM - 6:00 PM" },
      { days: "Saturday", time: "11:00 AM - 5:00 PM" },
      { days: "Sunday", time: "Closed" }
    ]
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src="/images/products/slideew.jpg"
              alt="Contact KibidouArt"
              fill
              className="object-cover object-center transform scale-105"
              priority
              sizes="100vw"
              quality={95}
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60 z-10" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <motion.div 
                className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
              <p className="text-xl text-stone-100 max-w-2xl mx-auto">
                We'd love to hear from you. Reach out to our team for inquiries about our collection, services, or any questions you may have.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section with Form and Info */}
      <section ref={formRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              className="bg-stone-50 p-10 rounded-xl shadow-md border border-stone-200"
            >
              <motion.div 
                className="w-20 h-1 bg-brown-500 mb-6"
                initial={{ width: 0 }}
                animate={{ width: formInView ? 80 : 0 }}
                transition={{ duration: 0.8 }}
              />
              <h2 className="text-3xl font-bold text-stone-900 mb-6">Get In Touch</h2>
              <p className="text-stone-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible. We value your interest in our art collection.
              </p>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg mb-8"
                >
                  <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                  <p>Your message has been successfully sent. We will contact you very soon!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-stone-700 text-sm font-medium mb-2" htmlFor="name">
                      Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-stone-700 text-sm font-medium mb-2" htmlFor="email">
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-stone-700 text-sm font-medium mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <select 
                      id="subject" 
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Artwork Purchase">Artwork Purchase</option>
                      <option value="Custom Commission">Custom Commission</option>
                      <option value="Artist Collaboration">Artist Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-stone-700 text-sm font-medium mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#78350f' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-brown-700 text-white rounded-lg font-medium hover:bg-brown-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message <Send size={16} />
                  </motion.button>
                </form>
              )}
            </motion.div>
            
            {/* Contact Info */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="w-20 h-1 bg-brown-500 mb-6"
                initial={{ width: 0 }}
                animate={{ width: formInView ? 80 : 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <h2 className="text-3xl font-bold text-stone-900 mb-6">Contact Information</h2>
              <p className="text-stone-600 mb-10">
                You can reach out to us through any of the following methods. Our team is ready to assist you with any questions or requests.
              </p>
              
              <div className="space-y-8">
                <motion.div 
                  className="flex items-start gap-5"
                  variants={itemVariant}
                >
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Our Gallery Address</h3>
                    <p className="text-stone-600">{contactInfo.address}</p>
                    <Link href="https://maps.google.com" target="_blank" className="text-brown-700 flex items-center gap-1 mt-2 hover:text-brown-900 transition-colors">
                      Get Directions <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-5"
                  variants={itemVariant}
                >
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Email Us</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-stone-600 hover:text-brown-700 transition-colors">
                      {contactInfo.email}
                    </a>
                    <p className="text-stone-600 mt-1">We typically respond within 24 hours</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-5"
                  variants={itemVariant}
                >
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Call Us</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-stone-600 hover:text-brown-700 transition-colors">
                      {contactInfo.phone}
                    </a>
                    <p className="text-stone-600 mt-1">Monday to Friday, 10am-6pm</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-5"
                  variants={itemVariant}
                >
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Opening Hours</h3>
                    <div className="space-y-1">
                      {contactInfo.hours.map((hour, index) => (
                        <div key={index} className="flex justify-between text-stone-600">
                          <span className="font-medium">{hour.days}</span>
                          <span>{hour.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={itemVariant}
                  className="pt-6 mt-8 border-t border-stone-200"
                >
                  <h3 className="text-xl font-semibold text-stone-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center hover:bg-brown-200 transition-colors">
                      <Instagram className="h-5 w-5 text-brown-700" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center hover:bg-brown-200 transition-colors">
                      <Facebook className="h-5 w-5 text-brown-700" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center hover:bg-brown-200 transition-colors">
                      <Twitter className="h-5 w-5 text-brown-700" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center hover:bg-brown-200 transition-colors">
                      <Linkedin className="h-5 w-5 text-brown-700" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section ref={mapRef} className="py-24 bg-stone-100 relative overflow-hidden">
        <div className="absolute -right-40 top-20 w-80 h-80 bg-brown-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -left-40 bottom-20 w-80 h-80 bg-amber-100 rounded-full opacity-40 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={mapInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: mapInView ? 96 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Visit Our Gallery</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Experience our art collection in person. Our gallery is located in the heart of New York City.
            </p>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={mapInView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="rounded-xl overflow-hidden shadow-lg border border-stone-200"
          >
            {/* This would typically be a Google Maps iframe, but for this mockup we'll use a placeholder image */}
            <div className="relative w-full h-[500px]">
              <Image 
                src="/images/products/a1cda2b1-2c54-43ea-867c-edac9377a1b6.jpeg"
                alt="Map Location"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-8 py-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">KibidouArt Gallery</h3>
                  <p className="text-stone-600">{contactInfo.address}</p>
                  <Link 
                    href="https://maps.google.com" 
                    target="_blank"
                    className="mt-4 inline-block py-2 px-6 bg-brown-700 text-white rounded-lg font-medium hover:bg-brown-800 transition-colors"
                  >
                    Get Directions
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section ref={faqRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: faqInView ? 96 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Frequently Asked Questions</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Find answers to common questions about our art collection, purchasing process, shipping, and more.
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
          >
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariant}
                className="mb-6"
              >
                <button 
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                  className={`w-full flex justify-between items-center p-6 rounded-lg ${
                    activeQuestion === index 
                      ? 'bg-brown-700 text-white' 
                      : 'bg-stone-50 text-stone-900 hover:bg-stone-100'
                  } transition-colors duration-300`}
                >
                  <span className="font-medium text-left">{item.question}</span>
                  {activeQuestion === index ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 bg-stone-50 rounded-b-lg border-t border-stone-200">
                    <p className="text-stone-600">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brown-800 to-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brown-700/20 via-transparent to-transparent opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Find Your Perfect Art Piece?
            </motion.h2>
            <motion.p 
              className="text-xl mb-10 text-stone-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Browse our collection today and discover artworks that speak to your soul
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/frontend/boutique">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-stone-900 px-8 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-brown-700/20 hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
                >
                  Explore Collection <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
