import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2 } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.6 }} // Delayed to appear after the loader
        style={{ maxWidth: '800px', zIndex: 10, position: 'relative' }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.8 }}
          style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          Welcome to my portfolio
        </motion.h2>
        
        <h1 style={{ fontSize: '7rem', lineHeight: '1', marginBottom: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="text-gradient text-glow" style={{ color: '#b200ff' }}>OBITO</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
          Specializing in advanced automations, custom Discord bots, and robust backend architectures. Building the future, one line of code at a time.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 20 }}>
          <button 
            onClick={() => window.lenis?.scrollTo('#projects', { duration: 3.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Terminal size={20} />
            View Projects
          </button>
          <button 
            onClick={() => window.lenis?.scrollTo('#contact', { duration: 4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid var(--accent-purple)', color: 'var(--text-primary)', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Code2 size={20} />
            Contact Me
          </button>
        </div>
      </motion.div>

      {/* Right Side Obito Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 2.8 }}
        style={{ zIndex: 10, flex: 1, display: 'flex', justifyContent: 'center' }}
      >
        <img 
          src="/obito.jpg" 
          alt="Obito Logo" 
          style={{ 
            width: '100%', 
            maxWidth: '450px', 
            borderRadius: '24px', 
            boxShadow: '0 0 50px rgba(178, 0, 255, 0.4)', 
            border: '2px solid rgba(138, 43, 226, 0.3)',
            objectFit: 'cover',
            transform: 'perspective(1000px) rotateY(-15deg)'
          }} 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </motion.div>

      {/* Decorative Glow Elements */}
      <div style={{ 
        position: 'absolute', 
        right: '10%', 
        top: '20%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(178,0,255,0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        zIndex: 1,
        borderRadius: '50%'
      }} />
    </section>
  );
};

export default Hero;
