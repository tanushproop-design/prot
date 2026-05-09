import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import DiscordProfile from './components/DiscordProfile';
import HelixServer from './components/HelixServer';
import Contact from './components/Contact';
import MouseFollower from './components/MouseFollower';
import Starfield from './components/Starfield';

function App() {
  useEffect(() => {
    // Initialize Lenis for smooth slow-motion scrolling
    const lenis = new Lenis({
      duration: 2.5, // Slow down scroll for that premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ position: 'relative', cursor: 'none' }}>
      <Starfield />
      <Loader />
      <MouseFollower />
      <Hero />
      <DiscordProfile />
      <HelixServer />
      <Skills />
      <Projects />
      <Contact />
      
      {/* Simple Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(138,43,226,0.2)', marginTop: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} - OBITO | Engineered with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
