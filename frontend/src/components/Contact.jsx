import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ username: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // SECRET EASTER EGG TRIGGER
    if (
      formData.username.trim().toLowerCase() === 'emmu' &&
      formData.email.trim().toLowerCase() === 'emmu' &&
      formData.message.trim().toLowerCase() === 'emmu'
    ) {
      setShowSecret(true);
      setFormData({ username: '', email: '', message: '' });
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ username: '', email: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <>
      <section id="contact" className="container" style={{ padding: '100px 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
            Contact <span className="text-gradient text-glow">OBITO</span>
          </h2>

          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email (will send to nexa.8000@gmail.com)</label>
                <input 
                  type="text" // Changed to text so "emmu" can be typed without HTML5 validation error
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Message</label>
                <textarea 
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontFamily: 'Outfit', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '1rem' }} disabled={status === 'sending'}>
                <Send size={20} />
                {status === 'sending' ? 'Sending...' : 'Send Transmission'}
              </button>

              {status === 'success' && <p style={{ color: 'var(--accent-neon)', textAlign: 'center', marginTop: '1rem' }}>Message sent successfully!</p>}
              {status === 'error' && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>Failed to send message. Is backend running?</p>}
            </form>
          </div>
        </motion.div>
      </section>

      {/* Secret Emilyy Modal */}
      {showSecret && (
        <div 
          onClick={() => setShowSecret(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Flowing Hearts Background */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
             {[...Array(30)].map((_, i) => (
                <div key={i} className="floating-heart" style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}>❤️</div>
             ))}
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '380px',
              background: 'linear-gradient(135deg, rgba(178,0,255,0.15), rgba(20,10,30,0.95))',
              border: '2px solid rgba(178,0,255,0.4)',
              borderRadius: '24px', padding: '2.5rem',
              boxShadow: '0 0 60px rgba(178,0,255,0.3)',
              textAlign: 'center', position: 'relative',
              animation: 'modalPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 1
            }}
          >
            <div 
              onClick={() => setShowSecret(false)} 
              style={{ 
                position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', 
                color: '#b200ff', fontSize: '1.2rem', width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(178,0,255,0.1)', borderRadius: '50%', zIndex: 10
              }}
            >
              ✕
            </div>

            {/* Profile Avatar */}
            <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1.5rem auto' }}>
               <img 
                src="/emilyy.jpg" 
                alt="Emilyy" 
                style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  border: '4px solid #b200ff', objectFit: 'cover',
                  boxShadow: '0 0 30px rgba(178,0,255,0.5)'
                }} 
              />
               <div style={{ 
                 position: 'absolute', bottom: '0', right: '0', 
                 fontSize: '1.5rem', background: '#1a0b1c', borderRadius: '50%', 
                 padding: '6px', border: '2px solid #b200ff',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 boxShadow: '0 0 10px rgba(178,0,255,0.5)'
               }}>💜</div>
            </div>

            <h2 style={{ fontSize: '2.8rem', color: '#e0b0ff', textShadow: '0 0 15px rgba(178,0,255,0.6)', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 0.2rem 0' }}>Emilyy</h2>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 0.2rem 0', letterSpacing: '2px' }}>ILY</p>
            <p style={{ color: '#d8b4e2', fontSize: '1rem', fontStyle: 'italic', opacity: 0.9, marginBottom: '2rem' }}>Taken by Emmu 💜</p>

            {/* 4 Matching PFPs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  style={{ 
                    width: '100%', aspectRatio: '1/1', borderRadius: '16px', 
                    overflow: 'hidden', border: '2px solid rgba(178,0,255,0.3)', 
                    boxShadow: '0 0 20px rgba(178,0,255,0.15)', cursor: 'pointer'
                  }}
                >
                  <img 
                    src={`/match${num}.png`} 
                    alt={`Matching PFP ${num}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.5) rotate(-20deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100px) scale(1.5) rotate(20deg); opacity: 0; }
        }
        .floating-heart {
          position: absolute;
          bottom: -50px;
          color: #b200ff;
          font-size: 1.5rem;
          opacity: 0;
          animation: floatUp linear infinite;
          text-shadow: 0 0 10px rgba(178,0,255,0.5);
        }
      `}</style>
    </>
  );
};

export default Contact;
