"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Users, Award, Palette, HeartHandshake, MapPin, Calendar, Mail, Phone } from "lucide-react";

export default function AboutPage() {
  // Refs for scroll animations
  const missionRef = useRef(null);
  const historyRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);
  
  // Check if sections are in view
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const historyInView = useInView(historyRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.3 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 });
  
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
  
  // Team members data
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Creative Director",
      bio: "With over 15 years in the art world, Sarah founded KibidouArt with a vision to connect exceptional artists with art enthusiasts globally.",
      image: "/images/products/f42182ac-a4dd-4171-b84b-458cc43148b7.jpeg"
    },
    {
      name: "Ahmed Benali",
      role: "Head Curator",
      bio: "Ahmed specializes in Moroccan and contemporary art, bringing his expertise in identifying unique artistic expressions to our collection.",
      image: "/images/products/2a4bc75b-9eea-4fc4-b690-ac40a3c4871e.jpeg"
    },
    {
      name: "Elena Rodriguez",
      role: "Artist Relations",
      bio: "Elena works directly with our artists, ensuring their vision is represented authentically and helping them connect with our global audience.",
      image: "/images/products/14f4b8c1-abef-4a6e-8110-7c6c3d98d0f2.jpeg"
    },
    {
      name: "Michael Zhang",
      role: "Director of Operations",
      bio: "Michael oversees all operational aspects of KibidouArt, ensuring each artwork is carefully handled from creation to delivery.",
      image: "/images/products/73e83ebd-29d3-42d7-bef2-574fb106d377.jpeg"
    }
  ];

  // Timeline events
  const timelineEvents = [
    {
      year: "2018",
      title: "Foundation",
      description: "KibidouArt was founded with a mission to connect artists and art enthusiasts globally."
    },
    {
      year: "2019",
      title: "First Gallery",
      description: "Our first physical gallery opened, showcasing works from 25 artists across different mediums."
    },
    {
      year: "2020",
      title: "Digital Expansion",
      description: "Launched our online platform to bring art to people's homes during challenging times."
    },
    {
      year: "2021",
      title: "Artist Partnerships",
      description: "Established partnerships with over 75 artists from diverse backgrounds and traditions."
    },
    {
      year: "2022",
      title: "International Growth",
      description: "Expanded shipping to 30+ countries, bringing global art to a worldwide audience."
    },
    {
      year: "2023",
      title: "KibidouArt Today",
      description: "Now representing 100+ artists and delivering authentic artwork to collectors in over 40 countries."
    }
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <Image 
          src="/images/products/19d09a80-2ad9-4e7d-b519-25b333ec2ae7.jpeg"
          alt="KibidouArt Gallery"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        
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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Story</h1>
              <p className="text-xl text-stone-100 max-w-2xl mx-auto">
                Discover the passion and purpose behind KibidouArt, where we connect exceptional artists with art enthusiasts around the world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative"
              variants={fadeIn}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image 
                  src="/images/products/collection1.png"
                  alt="Our mission"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-2xl overflow-hidden border-4 border-white">
                <Image 
                  src="/images/products/f45ab71e-4395-4dd1-9b9b-c7ca82904477.jpeg"
                  alt="Artist at work"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={missionInView ? "visible" : "hidden"}
              className="lg:pl-8"
            >
              <motion.div 
                className="w-20 h-1 bg-brown-500 mb-6"
                initial={{ width: 0 }}
                animate={{ width: missionInView ? 80 : 0 }}
                transition={{ duration: 0.8 }}
              />
              <h2 className="text-4xl font-bold text-stone-900 mb-6">Our Mission & Vision</h2>
              <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                At KibidouArt, we believe that exceptional art should be accessible to everyone. Our mission is to connect talented artists from diverse backgrounds with art enthusiasts globally, bringing authentic artistic expression into homes and spaces around the world.
              </p>
              <p className="text-lg text-stone-700 mb-8 leading-relaxed">
                We envision a world where art transcends boundaries, where traditional craftsmanship and contemporary vision coexist, and where each piece tells a unique story that resonates with its owner.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Quality & Authenticity</h3>
                    <p className="text-stone-600">Every artwork is handcrafted and comes with a certificate of authenticity.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Palette className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Artistic Diversity</h3>
                    <p className="text-stone-600">We celebrate diverse artistic traditions and contemporary expressions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Artist Support</h3>
                    <p className="text-stone-600">We provide fair compensation and global visibility for our talented artists.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-6 w-6 text-brown-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Customer Experience</h3>
                    <p className="text-stone-600">We strive to provide exceptional service from discovery to delivery.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our History Section */}
      <section ref={historyRef} className="py-24 bg-stone-100 relative overflow-hidden">
        <div className="absolute -right-40 top-20 w-80 h-80 bg-brown-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -left-40 bottom-20 w-80 h-80 bg-amber-100 rounded-full opacity-40 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={historyInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: historyInView ? 96 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Our Journey</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              From our humble beginnings to becoming a global art destination, discover the milestones that have shaped KibidouArt.
            </p>
          </motion.div>
          
          <motion.div 
            className="relative max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={historyInView ? "visible" : "hidden"}
          >
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-brown-300 transform -translate-x-1/2"></div>
            
            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={event.year}
                className={`flex items-start mb-16 relative ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                variants={itemVariant}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className={`bg-white p-6 rounded-xl shadow-md border border-stone-200 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                    <span className="text-brown-700 font-bold text-sm mb-2 block">{event.year}</span>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{event.title}</h3>
                    <p className="text-stone-600">{event.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-6 w-10 h-10 bg-brown-600 rounded-full transform -translate-x-1/2 border-4 border-white flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Section */}
      <section ref={teamRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: teamInView ? 96 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Meet Our Team</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The passionate people behind KibidouArt who work tirelessly to bring exceptional artwork to your doorstep.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name}
                className="bg-stone-50 rounded-xl overflow-hidden border border-stone-200 shadow-md"
                variants={itemVariant}
              >
                <div className="relative aspect-square">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{member.name}</h3>
                  <p className="text-brown-700 font-medium text-sm mb-4">{member.role}</p>
                  <p className="text-stone-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Contact & Visit Section */}
      <section ref={contactRef} className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brown-700/20 via-transparent to-transparent opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="w-24 h-1 bg-brown-500 mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: contactInView ? 96 : 0 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-4xl font-bold mb-4 text-white">Visit Our Gallery</h2>
            <p className="text-stone-300 max-w-2xl mx-auto">
              Experience our collection in person or reach out to us for any inquiries about our artworks, artists, or services.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-xl"
              variants={fadeIn}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-6">
                <Image 
                  src="/images/products/9bbc07d7-885f-41fb-9cb8-bb130e19e464.jpeg"
                  alt="Our Gallery"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">Main Gallery</h3>
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="h-5 w-5 text-brown-400 flex-shrink-0 mt-1" />
                <p className="text-stone-300">
                  123 Art Gallery Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brown-400" />
                  <span className="text-stone-300">+1 (234) 567-890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brown-400" />
                  <span className="text-stone-300">info@kibidou.com</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold mb-2">Opening Hours</h4>
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <span>Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                  <span>Saturday</span>
                  <span>11:00 AM - 5:00 PM</span>
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-xl"
              variants={fadeIn}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="name">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brown-500"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brown-500"
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brown-500"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#78350f' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-brown-700 text-white rounded-lg font-medium hover:bg-brown-800 transition-colors flex items-center justify-center gap-2"
                >
                  Send Message <ArrowRight size={16} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
