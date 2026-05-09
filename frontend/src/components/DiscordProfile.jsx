import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const DiscordProfile = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUserIdRef = useRef(null);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/discord-stats');
        const result = await response.json();
        if (result.users) {
          setUsersData(result.users);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Discord data from backend", error);
        setLoading(false);
      }
    };

    fetchDiscordData();
    const interval = setInterval(fetchDiscordData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    online: '#43b581',
    idle: '#faa61a',
    dnd: '#f04747',
    offline: '#747f8d'
  };

  const openModal = (userId) => {
    selectedUserIdRef.current = userId;
    setSelectedUserId(userId);
  };

  const closeModal = () => {
    selectedUserIdRef.current = null;
    setSelectedUserId(null);
  };

  if (loading) return null;

  const selectedUser = usersData.find(u => u.id === selectedUserId);

  return (
    <>
      <section className="container" style={{ padding: '50px 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            Team <span className="text-gradient text-glow">Activity</span>
          </h2>

          {usersData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#f04747' }}>Failed to connect to Discord Bot or no users found.</p>
          ) : (() => {
            const owner = usersData.find(u => u.username === '9p7t');
            const team = usersData.filter(u => u.username !== '9p7t');
            const ownerStatusColor = owner ? (statusColors[owner.status] || statusColors.offline) : '#747f8d';
            const ownerCustomStatus = owner ? owner.activities.find(a => a.type === 4) : null;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                
                {/* OWNER - Big Card */}
                {owner && (
                  <div 
                    onClick={() => openModal(owner.id)}
                    className="glass-panel"
                    style={{ 
                      padding: '1.5rem 2.5rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem', 
                      background: 'linear-gradient(135deg, rgba(178,0,255,0.15), rgba(20,20,30,0.8))',
                      border: '1px solid rgba(178,0,255,0.3)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      maxWidth: '500px',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(178,0,255,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                      <img 
                        src={owner.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                        alt={owner.username} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${ownerStatusColor}`, objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                      />
                      {owner.avatarDecoration && (
                        <img src={owner.avatarDecoration} alt="Decoration" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', pointerEvents: 'none', zIndex: 1 }} />
                      )}
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '18px', height: '18px', backgroundColor: ownerStatusColor, borderRadius: '50%', border: '3px solid var(--glass-bg)', zIndex: 2 }}></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#fff' }}>{owner.displayName || owner.username}</h3>
                        <span style={{ background: '#b200ff', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>OWNER</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>@{owner.username}</span>
                      {ownerCustomStatus && ownerCustomStatus.state && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-neon)', marginTop: '4px', fontStyle: 'italic' }}>
                          {ownerCustomStatus.state}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TEAM MEMBERS - Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', width: '100%' }}>
                  {team.map((user) => {
                    const statusColor = statusColors[user.status] || statusColors.offline;
                    const customStatus = user.activities.find(a => a.type === 4);

                    return (
                      <div 
                        key={user.id}
                        className="glass-panel" 
                        onClick={() => openModal(user.id)}
                        style={{ 
                          padding: '1rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem', 
                          background: 'rgba(20,20,30,0.6)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(138,43,226,0.4)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                          <img 
                            src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                            alt={user.username} 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', border: `2px solid ${statusColor}`, objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }}
                          />
                          <div style={{ 
                            position: 'absolute', bottom: '-2px', right: '-2px', 
                            width: '14px', height: '14px', 
                            backgroundColor: statusColor, borderRadius: '50%', 
                            border: '2px solid var(--glass-bg)', zIndex: 2
                          }}></div>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h4 style={{ fontSize: '1rem', margin: 0, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {user.displayName || user.username}
                            </h4>
                            <span style={{ background: 'rgba(138,43,226,0.3)', color: 'var(--accent-neon)', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold', flexShrink: 0 }}>TEAM</span>
                          </div>
                          {customStatus && customStatus.state && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {customStatus.state}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </motion.div>
      </section>

      {/* MODAL - completely outside the section, no framer-motion */}
      {selectedUser && (
        <div 
          id="profile-modal-backdrop"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '420px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, rgba(30, 15, 50, 0.98), rgba(10, 10, 15, 0.98))',
              border: '1px solid rgba(138,43,226,0.4)',
              borderRadius: '24px',
              padding: '0',
              boxShadow: '0 0 60px rgba(138,43,226,0.3)',
              position: 'relative',
              animation: 'modalPopIn 0.25s ease-out',
            }}
          >
            {/* CLOSE BUTTON */}
            <div 
              id="close-modal-btn"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100000,
                color: '#fff',
                fontSize: '22px',
                fontWeight: 'bold',
                lineHeight: '1',
                userSelect: 'none',
              }}
            >
              ✕
            </div>

            {(() => {
              const statusColor = statusColors[selectedUser.status] || statusColors.offline;
              const statusLabel = selectedUser.status === 'dnd' ? 'Do Not Disturb' : selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1);
              const customStatus = selectedUser.activities.find(a => a.type === 4);
              const otherActivities = selectedUser.activities.filter(a => a.type !== 4);

              return (
                <>
                  {/* Banner */}
                  <div style={{ 
                    width: '100%', height: '90px', 
                    borderRadius: '24px 24px 0 0',
                    background: `linear-gradient(135deg, ${statusColor}44, rgba(138,43,226,0.4))`,
                  }} />

                  <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', marginTop: '-55px' }}>
                      <img 
                        src={selectedUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                        alt={selectedUser.username} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(30, 15, 50, 1)', objectFit: 'cover' }}
                      />
                      {selectedUser.avatarDecoration && (
                        <img 
                          src={selectedUser.avatarDecoration} 
                          alt="Decoration" 
                          style={{ position: 'absolute', top: '-15%', left: '-15%', width: '130%', height: '130%', pointerEvents: 'none', zIndex: 1 }}
                        />
                      )}
                      <div style={{ 
                        position: 'absolute', bottom: '2px', right: '2px', 
                        width: '24px', height: '24px', 
                        backgroundColor: statusColor, borderRadius: '50%', 
                        border: '4px solid rgba(30, 15, 50, 1)', zIndex: 2
                      }}></div>
                    </div>

                    {/* Name */}
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#fff' }}>
                        {selectedUser.displayName || selectedUser.username}
                      </h3>
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>@{selectedUser.username}</span>
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '12px', background: `${statusColor}22`, justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColor }}></div>
                        <span style={{ fontSize: '0.85rem', color: statusColor, fontWeight: 'bold' }}>{statusLabel}</span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                    {/* Bio (Custom Status) */}
                    {customStatus && customStatus.state && (
                      <div style={{ 
                        width: '100%', fontSize: '1rem', 
                        color: 'var(--text-primary)', fontStyle: 'italic', 
                        background: 'rgba(255,255,255,0.04)', 
                        padding: '14px 16px', borderRadius: '12px',
                        borderLeft: `4px solid ${statusColor}`,
                      }}>
                        "{customStatus.state}"
                      </div>
                    )}

                    {/* Rich Presence */}
                    {otherActivities.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Activities</span>
                        {otherActivities.map((activity, i) => (
                          <div key={i} style={{ padding: '14px', background: 'rgba(0,0,0,0.35)', borderRadius: '12px', borderLeft: '3px solid var(--accent-purple)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                              {activity.type === 0 ? 'Playing' : activity.type === 2 ? 'Listening to' : 'Doing'}
                            </div>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.05rem' }}>{activity.name}</div>
                            {activity.details && <div style={{ marginTop: '4px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{activity.details}</div>}
                            {activity.state && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{activity.state}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {otherActivities.length === 0 && (!customStatus || !customStatus.state) && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', fontStyle: 'italic' }}>No active status or activity right now.</p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPopIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default DiscordProfile;
