import React, { useEffect, useRef, useMemo } from 'react';

const Starfield = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starRefs = useRef([]);
  const rafRef = useRef(null);

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    // Animation loop for repel effect
    const REPEL_RADIUS = 120;
    const REPEL_STRENGTH = 40;

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y + window.scrollY;

      starRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sx = rect.left + rect.width / 2;
        const sy = rect.top + rect.height / 2;

        const dx = sx - mx + window.scrollX;
        const dy = (sy) - (mouseRef.current.y);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          const angle = Math.atan2(dy, dx);
          const tx = Math.cos(angle) * force;
          const ty = Math.sin(angle) * force;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        } else {
          el.style.transform = 'translate(0, 0)';
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {stars.map((star, i) => (
          <div
            key={star.id}
            ref={(el) => starRefs.current[i] = el}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              background: '#fff',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              boxShadow: star.size > 1.5 ? '0 0 4px rgba(178,0,255,0.5)' : 'none',
              transition: 'transform 0.3s ease-out',
              willChange: 'transform',
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Starfield;
