import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, CircleDot, CircleOff } from 'lucide-react';

const HelixServer = () => {
  const [serverStats, setServerStats] = useState(null);

  useEffect(() => {
    const fetchServerStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/discord-stats');
        const result = await response.json();
        if (result.server) {
          setServerStats(result);
        }
      } catch (error) {
        console.error("Failed to fetch Server stats", error);
      }
    };

    fetchServerStats();
    const interval = setInterval(fetchServerStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container" style={{ padding: '50px 2rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="glass-panel" style={{ 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(20,20,30,0.8), rgba(138,43,226,0.1))',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(178,0,255,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
            <img 
              src="/hx.jpg" 
              alt="Helix Server Logo" 
              style={{ width: '120px', height: '120px', borderRadius: '24px', marginBottom: '1rem', border: '2px solid var(--accent-purple)', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Helix&background=8a2be2&color=fff&size=128';
              }}
            />
            
            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>HeliX Server</h3>
            <p style={{ color: 'var(--accent-neon)', fontWeight: 'bold', marginBottom: '1.5rem', letterSpacing: '2px' }}>OWNER: OBITO</p>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              The central hub for all our projects, bots, and advanced digital experiments.
            </p>
            
            {/* Real-time Server Stats */}
            {serverStats && serverStats.server && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                width: '100%', 
                marginBottom: '2rem',
                background: 'rgba(0,0,0,0.4)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <Users size={20} color="var(--text-secondary)" />
                  <span>Total Members: <strong style={{ color: 'white' }}>{serverStats.server.total}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <Bot size={20} color="var(--accent-purple)" />
                  <span>Bots: <strong style={{ color: 'white' }}>{serverStats.server.bots}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <CircleDot size={20} color="#43b581" />
                  <span>Online: <strong style={{ color: 'white' }}>{serverStats.server.online}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <CircleOff size={20} color="#747f8d" />
                  <span>Offline: <strong style={{ color: 'white' }}>{serverStats.server.offline}</strong></span>
                </div>
              </div>
            )}

            {/* Helix Bots */}
            {serverStats && serverStats.targetBots && serverStats.targetBots.length > 0 && (
              <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <h4 style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start', margin: 0 }}>Verified Apps</h4>
                {serverStats.targetBots.map(bot => {
                  const statusColors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
                  const statusColor = statusColors[bot.status] || statusColors.offline;
                  
                  // Extract custom status or rich presence for the bot's bio
                  const customStatus = bot.activities.find(a => a.type === 4)?.state;
                  const richPresence = bot.activities.find(a => a.type !== 4)?.state || bot.activities.find(a => a.type !== 4)?.name;
                  const bio = customStatus || richPresence || "Online and ready";

                  return (
                    <div key={bot.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={bot.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                          alt={bot.username} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '-2px', 
                          right: '-2px', 
                          width: '14px', 
                          height: '14px', 
                          backgroundColor: statusColor, 
                          borderRadius: '50%', 
                          border: '2px solid var(--glass-bg)' 
                        }}></div>
                      </div>
                      
                      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h5 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{bot.displayName || bot.username}</h5>
                          <span style={{ background: '#5865F2', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>APP</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {bio}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <a href="https://discord.com/invite/uBZQDKuVxa" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                Join Server
              </button>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HelixServer;
