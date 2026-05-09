import React, { useEffect, useRef, useState } from 'react';

const MouseFollower = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const onMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + 'px';
        ringRef.current.style.top = e.clientY + 'px';
      }
    };

    const onClick = (e) => {
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 600);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      {/* Inner dot - no transition, instant */}
      <div ref={dotRef} style={{
        position: 'fixed',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: '#b200ff',
        boxShadow: '0 0 15px #b200ff, 0 0 30px rgba(178,0,255,0.4)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 999999,
        top: 0, left: 0,
      }} />

      {/* Outer ring - tiny transition for smooth feel */}
      <div ref={ringRef} style={{
        position: 'fixed',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1.5px solid rgba(178,0,255,0.4)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 999999,
        top: 0, left: 0,
        transition: 'left 0.06s linear, top 0.06s linear',
      }} />

      {/* Click ripples */}
      {clicks.map(c => (
        <div key={c.id} style={{
          position: 'fixed',
          left: c.x + 'px',
          top: c.y + 'px',
          width: '10px', height: '10px',
          borderRadius: '50%',
          border: '2px solid #b200ff',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 999999,
          animation: 'clickRipple 0.6s ease-out forwards',
        }} />
      ))}

      <style>{`
        @keyframes clickRipple {
          0% { width: 10px; height: 10px; opacity: 1; border-width: 2px; }
          100% { width: 80px; height: 80px; opacity: 0; border-width: 0.5px; }
        }
      `}</style>
    </>
  );
};

export default MouseFollower;
