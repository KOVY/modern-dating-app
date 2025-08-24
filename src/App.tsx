import React, { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

const DatingApp = () => {
  const [currentProfile, setCurrentProfile] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { user, logout } = useAuth();

  const profiles = [
    {
      id: 1,
      name: 'Tereza',
      age: 24,
      location: 'Praha',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&auto=format&q=80'],
      bio: 'Miluji cestování a dobrou kávu ☕',
      interests: ['☕ Káva', '✈️ Cestování', '📚 Čtení'],
      verified: true,
      premium: false,
      distance: 5,
      job: 'Marketing Manager'
    },
    {
      id: 2,
      name: 'Klára',
      age: 26,
      location: 'Brno',
      photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&auto=format&q=80'],
      bio: 'Fotografka a milovnice přírody 📸',
      interests: ['📸 Fotografie', '🌲 Příroda', '🥾 Hiking'],
      verified: true,
      premium: true,
      distance: 12,
      job: 'Fotografka'
    }
  ];

  const currentProfileData = profiles[currentProfile % profiles.length];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    setTimeout(() => {
      setCurrentProfile((prev) => (prev + 1) % profiles.length);
      setTimeout(() => {
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 100);
    }, 300);
  };

  if (!user) {
    return (
      <div className="dating-app">
        <div className="app-header">
          <div className="header-content">
            <div className="app-logo">
              <div style={{ fontSize: '28px' }}>💕</div>
              <div>
                <div className="app-title">LoveConnect</div>
                <div className="app-tagline">Najdi svou spřízněnou duši</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Vítejte v LoveConnect</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Přihlaste se nebo se zaregistrujte</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => setShowLogin(true)}
              className="action-btn btn-like"
              style={{ width: 'auto', padding: '15px 30px', borderRadius: '25px' }}
            >
              Přihlásit se
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="action-btn btn-super"
              style={{ width: 'auto', padding: '15px 30px', borderRadius: '25px' }}
            >
              Registrovat
            </button>
          </div>
        </div>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      </div>
    );
  }

  return (
    <div className="dating-app">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <div className="app-logo">
            <div style={{ fontSize: '28px' }}>💕</div>
            <div>
              <div className="app-title">LoveConnect</div>
              <div className="app-tagline">Najdi svou spřízněnou duši</div>
            </div>
          </div>
          
          <button
            onClick={logout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            👤
          </button>
        </div>
      </div>

      {/* Aurora Background Effect */}
      <div className="aurora"></div>

      {/* Main Profile Card */}
      <div className="profile-container">
        {currentProfileData && (
          <div className={`profile-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
            {/* Photo Section */}
            <div className="profile-photo-container">
              <img
                src={currentProfileData.photos[0]}
                alt={currentProfileData.name}
                className="profile-photo"
              />
              
              {/* Verification Badges */}
              <div className="verification-badges">
                {currentProfileData.verified && (
                  <div className="badge verified">✓ Ověřeno</div>
                )}
                {currentProfileData.premium && (
                  <div className="badge premium">★ Premium</div>
                )}
              </div>

              {/* Photo Overlay */}
              <div className="photo-overlay">
                <div className="profile-name">
                  {currentProfileData.name}, {currentProfileData.age}
                </div>
                <div className="profile-details">
                  <span>📍 {currentProfileData.location}</span>
                  <span>📏 {currentProfileData.distance} km</span>
                  <span>💼 {currentProfileData.job}</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <div className="profile-bio">
                {currentProfileData.bio}
              </div>
              
              <div className="profile-interests">
                {currentProfileData.interests.map((interest, index) => (
                  <div key={index} className="interest-tag">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-btn btn-pass"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
        >
          ✕
        </button>
        
        <button
          className="action-btn btn-like"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          💖
        </button>
        
        <button
          className="action-btn btn-super"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          ⭐
        </button>
      </div>
    </div>
  );
};

export default DatingApp;